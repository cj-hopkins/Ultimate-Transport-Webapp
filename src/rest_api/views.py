from .models import Stop, Route, Composite, Currentweather, FiveDayWeather, Timetable, Modelstops 
from .serializers import StopSerializer, RouteSerializer, RouteStopSerializer, TimeTableSerializer
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
import pandas as pd
from rest_api.nnPrediction import NNModel
from rest_api.weather_for_model import *
from rest_api.time_for_model import *
from math import cos, asin, sqrt

class getAllStops(generics.ListCreateAPIView):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer

class getAllRoutes(generics.ListCreateAPIView):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class getRouteStopComposite(generics.ListCreateAPIView):
    queryset = Composite.objects.all()
    serializer_class = RouteStopSerializer


@api_view(['GET'])
def getCurrentWeather(request):
    """ GET request from 'currentweather' table in database to return current weather to Django"""
    weather = Currentweather.objects.all()
    data = list(weather.values())
    print(data)
    return Response(data)
    
def getFiveDayWeather():
    """ GET request from 'fivedayweather' table in database to return five day weather to Django """
    weather = FiveDayWeather.objects.all()
    return list(weather.values())
    
@api_view(['GET'])
def getAllStopNumbers(request):
    """ GET request from 'composite' table in database to return stop id, address and location to Django"""
    stops = Composite.objects.order_by('stop_id').values('stop_id', 'address','location_text').distinct() 
    return Response(stops)

# @csrf_exempt
@api_view(['POST'])
def getStopsForRoute(request):
    """ POST request providing Django with information input about route number, direction and stops selected by user"""
    route = request.data.get('route')
    direction = request.data.get('direction')
    stops = Composite.objects.filter(name=route) \
                             .filter(route_direction=direction) \
                             .order_by('sequence_number') \
                             .values('stop_id', 'stop_lat', 'stop_lon',
                                'location_text', 'address', 'route_direction',
                                'rtpi_destination', 'rtpi_origin', 'sequence_number')
    stops = sorted(list({item["stop_id"]: item for item in stops}.values()),
        key = lambda x: x['sequence_number'])
    data = list(stops)
    return Response(data)


@api_view(['POST'])
def getTimeTable(request):
    """ POST request to Django to retrieve timetables for specified route, direction, stop ID and day of the week selected by user """
    lineid = request.data.get('lineid')
    direction = request.data.get('direction')
    stop = request.data.get('stop_id')
    weekday = request.data.get('weekday')
    sat = request.data.get('saturday')
    sun = request.data.get('sunday')
    table = Timetable.objects.filter(lineid=lineid) \
                             .filter(direction = direction) \
                             .filter(stop_id = stop) \
                             .filter(weekday = weekday) \
                             .filter(saturday = sat) \
                             .filter(sunday = sun)
    serializer = TimeTableSerializer(table, many=True)
    times = []
    for i in range(len(serializer.data)):
        times.append(serializer.data[i]['arrival_time'])
    return Response(times)

@api_view(['POST'])
def getModelPrediction(request):
    """ POST request to Django to return prediction for single journey based on selected parameters """
    route = request.data.get('route')
    print(route)
    start = request.data.get('start')
    finish = request.data.get('finish')
    direction = request.data.get('direction')
    selectedTime = request.data.get('selectedTime')
    selectedDate = request.data.get('selectedDate')
    isDefaultTime = request.data.get('isDefaultTime')

    result = makeModelPrediction(route, start, finish, direction, selectedTime, selectedDate, isDefaultTime)
    return JsonResponse({'prediction': result})

def makeModelPrediction(route, start, finish, direction, selectedTime, selectedDate, isDefaultTime, isMulti=False):
    """ Main function to get prediction for single journey based on inputs from user
    
    Keyword arguments:
    route -- bus number, e.g. 7
    start -- origin, stop number e.g. 324
    finish -- destination, stop number e.g. 782
    direction -- 1 or 2 (i.e. inbound or outbound)
    selectedTime -- time in value in seconds past midnight
    selectedDate -- unix value seconds past epoch
    isDefaultTime -- boolean value indicating whether user has selected current time
    isMulti=False -- indicates single journey only being calculated
    
    """
    weather_dictionary = getWeatherForPrediction(isDefaultTime , selectedTime, selectedDate)
    rain = weather_dictionary['rain']
    temp = weather_dictionary['temp']
    
    stops = Composite.objects.filter(name=route).filter(route_direction=direction).order_by('stop_id').values()
    stops = sorted(list({item["stop_id"]: item for item in stops}.values()), key = lambda x: x['stop_id'])

    startStop = Composite.objects.filter(stop_id=start) \
                                 .filter(name=route) \
                                 .values()[0] if start != 'start' \
                                 else min(stops, key = lambda x:x['sequence_number'])

    finishStop = Composite.objects.filter(stop_id=finish) \
                                  .filter(name=route).values()[0] if finish != 'finish' \
                                  else max(stops, key = lambda x: x['sequence_number'])
    
    nn_model = NNModel(route, direction, startStop, finishStop, stops)
    pkl = nn_model.parseRequest(nn_model.route, nn_model.direction)
    stopDf = nn_model.createStopDf()
    distances = nn_model.calculateDistances()
    
    time_df = get_time_and_date_df(selectedTime,selectedDate, nn_model,stopDf)
    weather_df = create_weather_df(rain, temp, stopDf, nn_model)

    index_to_insert_distances = 1    #distances has to go in middle of weather 
    weather_df.insert(loc=index_to_insert_distances, column='distance', value=distances)
    combined_df = pd.concat([weather_df, time_df,stopDf ], axis=1)
    
    return  nn_model.makePrediction(pkl, combined_df)

@api_view(['POST'])
def getMultiRoutePrediction(request):
    """ POST request to Django to return multi route prediction based on selected parameters """
    print("REQUEST", request.data)
    data = request.data['busRoutes']
    total = 0
    for step in data:
        selectedTime = 0
        selectedDate = 0
        isDefaultTime = True
        route = step['route']
        direction = Composite.objects.filter(name = route) \
                                     .filter(rtpi_destination = step['headsign']) \
                                     .values()[0]['route_direction']
        direction = 'I' if len(direction) == 0 else direction
        startLatLng = {'stop_lat': step['start']['lat'], 'stop_lon': step['start']['lng']}
        finishLatLng = {'stop_lat': step['finish']['lat'], 'stop_lon': step['finish']['lng']}

        stops = Composite.objects.filter(name = route).filter(route_direction = direction).values()
        for i in stops:
            i['stop_lat'] = float(i['stop_lat'])
            i['stop_lon'] = float(i['stop_lon'])
        closestStart = closest(stops, startLatLng)['stop_id']
        closestFinish = closest(stops, finishLatLng)['stop_id']
        total += makeModelPrediction(route, closestStart, closestFinish, direction, selectedTime, selectedDate, isDefaultTime, True)

    return JsonResponse({'prediction': total})

def getNumStopsInJourney(start, finish, route, direction):
    """ Function to get the number of stops in a selected journey
    
    Keyword arguments:
    start -- origin stop number e.g. 123
    finish -- destination stop number e.g. 34
    route -- bus number, e.g. 46A
    direction -- value of 1 or 2 (inbound or outbound)
    """
    stops = Composite.objects.filter(name=route).filter(route_direction = direction)
    stops = list(stops.values())
    if (start == "start" and finish == "finish"):
        return len(stops)
    startIndex, finishIndex = -1, -1
    for index, item in enumerate(stops):
        if item['stop_id'] == int(start):
            startIndex = index
        elif item['stop_id'] == int(finish):
            finishIndex = index
            break
    indicesFound = startIndex != -1 and finishIndex != -1 
    return finishIndex - startIndex if indicesFound else -1

def distance(lat1, lon1, lat2, lon2):
    """ Function to calculate distane between two points of latitude and longitude
    Keyword arguments:
    lat1 -- latitude value for first point
    lon1 -- longitude value for first point
    lat2 -- latitude value for second point
    lon2 -- longitude value for second point
    """
    p = 0.017453292519943295
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
    return 12742 * asin(sqrt(a))

closest = lambda data, v: min(data, key=lambda p: distance(v['stop_lat'],v['stop_lon'],p['stop_lat'],p['stop_lon']))