from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.conf.urls.static import static
from django.core import serializers
from .models import Stop, Route, Composite, Currentweather, FiveDayWeather, Timetable 
from .serializers import StopSerializer, RouteSerializer, RouteStopSerializer, TimeTableSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from django.views.decorators.csrf import csrf_exempt
#from braces.views import CsrfExemptMixin
import random
import json
import re
from rest_api.get_prediction import getPrediction, rf_model
import pandas as pd
import numpy as np 
import datetime
import time
#from datetime import datetime
from rest_api.nnPrediction import NNModel

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
    weather = Currentweather.objects.all()
    data = list(weather.values())
    print(data)
    return Response(data)
    # return JsonResponse({'weather': data})
    
@api_view(['GET'])
def getFiveDayWeather(request):
    weather = FiveDayWeather.objects.all()
    data = list(weather.values())
    return Response(data)
    # return JsonResponse({'weather': data})
    
@api_view(['GET'])
def getAllStopNumbers(request):
    stops = Composite.objects.order_by('stop_id').values('stop_id', 'address','location_text').distinct() 
    data = list(stops.values())
    return Response(stops)

# @csrf_exempt
@api_view(['POST'])
def getStopsForRoute(request):
    route = request.data.get('route')
    direction = request.data.get('direction')
    stops = Composite.objects.filter(name=route).filter(route_direction=direction).order_by('sequence_number')
    # stops = Composite.objects.filter(name=route).order_by('sequence_number')
    data = list(stops.values('stop_id', 'stop_lat', 'stop_lon', 'location_text', 'address', 'route_direction', 'rtpi_destination', 'rtpi_origin').distinct())
    # iDirection = [i for i in data if i['route_direction'] == 'I']
    # oDirection = [i for i in data if i['route_direction'] == 'O']
    # print(data)
    print(len(data))
    return Response(data)
    # return JsonResponse({"iDirection": iDirection, "oDirection": oDirection})


@api_view(['POST'])
def getTimeTable(request):
    lineid = request.data.get('lineid')
    direction = request.data.get('direction')
    stop = request.data.get('stop_id')
    weekday = request.data.get('weekday')
    sat = request.data.get('saturday')
    sun = request.data.get('sunday')
    table = Timetable.objects.filter(lineid=lineid).filter(direction = direction).filter(stop_id = stop).filter(weekday = weekday).filter(saturday = sat).filter(sunday = sun)
    serializer = TimeTableSerializer(table, many=True)
    times = []
    for i in range(len(serializer.data)):
        times.append(serializer.data[i]['arrival_time'])
    return Response(times)


@api_view(['POST'])
def getPredictionForJourney(request):
    route = request.data.get('route')
    start = request.data.get('start')
    finish = request.data.get('finish')
    direction = request.data.get('direction')
    selectedTime = request.data.get('selectedTime')
    selectedDate = request.data.get('selectedDate')
    isDefaultTime = request.data.get('isDefaultTime')
    current_time = time.time()
    epoch = datetime.datetime.utcfromtimestamp(0)
    time_in_5days_since_epoch = (datetime.datetime.now() + datetime.timedelta(days=5) - epoch).total_seconds() 
    numStops = getNumStopsInJourney(start, finish, route, direction)
    if numStops == -1:
        print("indexing failed")
    if isDefaultTime:
        isRaining = getRainNow()
        temp = getTempNow()
        print('temp',temp)
        result = getPrediction(numStops, isRaining,temp, selectedTime)
        return JsonResponse({'prediction':result[0]})
    else:
        if int(selectedDate) < time_in_5days_since_epoch: # weather forecast only for next 5 days
            isRaining = getRainNotNow(selectedTime,selectedDate )
            temp = getTempNotNow(selectedTime,selectedDate)
            print('temp',temp)
            result = getPrediction(numStops, isRaining,temp, selectedTime)
            return JsonResponse({'prediction':str(result[0])+ '  (Includes weather) '})
        else:
            isRaining = False  #default is NOT RAINING as average for eastcoast is raining 150 days per year
            temp= 16   #average temp in Ireland
            result = getPrediction(numStops, isRaining, temp ,selectedTime)
            return JsonResponse({'prediction':str(result[0])+ '\n\n(Weather not taken into account) '})

@api_view(['POST'])
def getModelPrediction(request):
    route = request.data.get('route')
    print(route)
    start = request.data.get('start')
    finish = request.data.get('finish')
    direction = request.data.get('direction')
    selectedTime = request.data.get('selectedTime')
    selectedDate = request.data.get('selectedDate')
    isDefaultTime = request.data.get('isDefaultTime')
    current_time = time.time()
    epoch = datetime.datetime.utcfromtimestamp(0)
    time_in_5days_since_epoch = (datetime.datetime.now() + datetime.timedelta(days=5) - epoch).total_seconds() 

    if (not isDefaultTime) and (int(selectedDate) < time_in_5days_since_epoch): # within next 5 days but not now
        rain =  getRainCategoryFuture(selectedTime,selectedDate)
        temp = getTempNotNow(selectedTime,selectedDate)
    else:
        rain =  getRainCategoryNow()  #use current weather if now or more than 5 days into future
        temp = getTempNow()
    print('RAIN', rain, 'temp', temp)
    
    
    
    
    # pklFileName = parseRequest(route, direction)
    stops = Composite.objects.filter(name=route).filter(route_direction=direction).order_by('stop_id').values()
    # startStop = Composite.objects.filter(stop_id=start).filter(name=route).values()[0] if start !== 'start' else stops[0]
    startStop = Composite.objects.filter(stop_id=start).filter(name=route).values()[0]
    finishStop = Composite.objects.filter(stop_id=finish).filter(name=route).values()[0]
    # finishStop = Composite.objects.filter(stop_id=finish).filter(name=route).values()[0] if finish !== 'finish' else stops[:-1]
    print("START", startStop)
    print("SEQ", startStop['sequence_number'])
    # print(type(stops))
    # stops = Composite.objects.filter()
    nn_model = NNModel(route, direction, startStop, finishStop, stops, rain)
    pkl = nn_model.parseRequest(nn_model.route, nn_model.direction)
    stopDf = nn_model.createStopDf()
    print(stopDf)
    print(selectedTime//3600)
    hour = selectedTime // 3600
    print(type(selectedDate))
    # tmp = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(int(selectedDate)))
    # print(tmp)
    day = datetime.datetime.fromtimestamp(int(selectedDate)/1000).strftime("%A")
    print(day)
    timeDf = nn_model.createTimeDf(hour, day)
    print(day)

    rainDf = getRainCategoryNow()
    print(rainDf)

    distances = nn_model.calculateDistances()
    print(distances)

    length = len(timeDf) + len(distances) + stopDf.shape[1] + 6
    print(length)

    df = pd.DataFrame(columns=[i for i in range(length)])

    # future_weather = FiveDayWeather.objects.values()
    # relevant_weather= get_temp_and_rain(future_weather, selectedTime, selectedDate )
    # print(relevant_weather)

    # if isDefaultTime:
    #     weather = Currentweather.values.all()

    # print(pkl)
    # Implement this 
    # timeArray = parseTime(selectedTime)
    # dayArray = parseDay(selectedDate)
    # startStopArray = createStopArray(route, direction getNumStopsInJourney(start, finish, route, direction))
    # makePrediction(pklFileName)
    return JsonResponse({'test': 'val'})

def getRainCategoryNow():
    weather_most_recent_entry = FiveDayWeather.objects.values().first()
    rain_now = pd.cut(pd.DataFrame([float(weather_most_recent_entry['rain'] )])[0], bins= [0,0.5,15,200], include_lowest=True, labels = ['Precipitation_None', 'Precipitation_Slight', 'Precipitation_Moderate'])
    return rain_now.iloc[0]

@api_view(['POST'])
def getMultiRoutePrediction(request):
    print("REQUEST", request.data)
    totalPrediction = 0
    # for item in request.data['busRoutes']:
    #     print("KEY", key)
    #     if isDefaultTime:
    #         isRaining = getRainNow()
    #         temp = getTempNow()
    #         print('temp',temp)
    #         result = getPrediction(item['numStops'], isRaining,temp, selectedTime)
    #         print(result)
    #         totalPrediction += result
    #         # return JsonResponse({'prediction':result[0]})
    return JsonResponse({'test': 'val'})

  
  
# class getStopsForRoute(CsrfExemptMixin, APIView):
#     def post(self, request):
#         route = request.data.get('route')
#         direction = request.data.get('direction')
#         # print(route)
#         # print(direction)
#         stops = Composite.objects.filter(name=route).filter(route_direction=direction)
#         data = list(stops.values())
#         return Response(data)

# def request(request):
#     return Response("request made")

def getNumStopsInJourney(start, finish, route, direction):
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
  
def getRainCategoryNow():
    weather_most_recent_entry = FiveDayWeather.objects.values().first()
    rain_now = pd.cut(pd.DataFrame([float(weather_most_recent_entry['rain'] )])[0], bins= [0,0.01,0.5,20], include_lowest=True, labels = ['Precipitation_None', 'Precipitation_Slight', 'Precipitation_Moderate'])
    return rain_now.iloc[0]  
  

def getRainCategoryFuture(chosenTime, chosenDate):
    future_weather = FiveDayWeather.objects.values()
    relevant_weather= get_temp_and_rain(future_weather ,chosenTime, chosenDate )
    rain_now = pd.cut(pd.DataFrame([float(relevant_weather['rain'] )])[0], bins= [0,0.01,0.5,20], include_lowest=True, labels = ['Precipitation_None', 'Precipitation_Slight', 'Precipitation_Moderate'])
    return rain_now.iloc[0]  
  
def getTempNow():
    weather = Currentweather.objects.values()[0]
    return weather['temperature']
  
def getTempNotNow(chosenTime, chosenDate):
    future_weather = FiveDayWeather.objects.values()
    relevant_weather= get_temp_and_rain(future_weather ,chosenTime, chosenDate )
    return relevant_weather['temp']
  
def get_temp_and_rain(response,seconds_past_midnight, epoch_time):
    """
    response: json from the getFiveDayWeather view in Django
    seconds_past_midnight:Time chosen (current time or from Django)
    epoch_time:Date chosen (from calendar)
    """
    def round_hour_nearest_3_hour(x):
        """
        Rounds to nearest 3 hour (also handles the edge case of 23:00)
        """
        if x==23:
            ans= 0
        else:
            ans= int(3 * round(x/3))
        return ans
    
    seconds_past_midnight_1970 =  pd.to_datetime(seconds_past_midnight,unit='s')  # seconds past midnight to dt 
    nearest_hour = seconds_past_midnight_1970.hour                         # get hour
    nearest_hour_multiple3 = round_hour_nearest_3_hour(nearest_hour)       # get nearest 3 hour interval
    
    epoch_dt_format = pd.to_datetime(epoch_time, unit='s')  # epoch time to dt object 
    day_of_month_chosen = epoch_dt_format.day               # get day

    for i in range(len(response)):    
        entry = response[i]
        time_for_entry =response[i]['timeofday']            #time in tring format
        formatted_time= pd.to_datetime(time_for_entry, format='%Y-%m-%dT%H:00:00Z') # dt object
        day_of_month = formatted_time.day
        hour = formatted_time.hour             # hour of response(will be in multiple of 3)
        day_of_week =formatted_time.dayofweek
        
        keys_for_dictionary = ['temp','rain','description']  # store relevant weather in dictionary
        
        res = {key: None for key in keys_for_dictionary}     # fill dictionary with Nones 
        
        if  day_of_month== day_of_month_chosen and hour==  nearest_hour_multiple3:
            res['temp'] =  entry['temperature'] 
            res['rain'] =  entry['rain']
            res['description'] =  entry['description'] 
            
            return res  #if there's weather info return it else return dictionary of Nones
    return res
    