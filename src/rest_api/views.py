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
from rest_api.nnPrediction import NNModel
from rest_api.weather_for_model import *
from rest_api.time_for_model import *
import decimal

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
    weather_dictionary = getWeatherForPrediction(isDefaultTime , selectedTime, selectedDate)
    rain = weather_dictionary['rain']
    temp = weather_dictionary['temp']
    
    # pklFileName = parseRequest(route, direction)
    stops = Composite.objects.filter(name=route).filter(route_direction=direction).order_by('stop_id').values()
    # uniqueStops = sorted(list(set(map(lambda x: x['stop_id'], stops))))
    # print([i['stop_id'], j for i, j in stops, uniqueStops])
    # stops = [item for index, item in enumerate(stops) if item['stop_id'] not in uniqueStops[index + 1:]]
    stops = sorted(list({item["stop_id"]: item for item in stops}.values()), key = lambda x: x['stop_id'])
    print("STOPS LIST", len(stops))

    
    # startStop = Composite.objects.filter(stop_id=start).filter(name=route).values()[0] if start !== 'start' else stops[0]
    startStop = Composite.objects.filter(stop_id=start).filter(name=route).values()[0] if start != 'start' else stops[0]
    # finishStop = Composite.objects.filter(stop_id=finish).filter(name=route).values()[0]
    finishStop = Composite.objects.filter(stop_id=finish).filter(name=route).values()[0] if finish != 'finish' else stops[-1]
    print("FINSIH", type(finishStop))
    print("FINSIH", finishStop)
    print("START", startStop)
    print("SEQ", startStop['sequence_number'])
    # stops = Composite.objects.filter()
    
    
    nn_model = NNModel(route, direction, startStop, finishStop, stops, rain)
    pkl = nn_model.parseRequest(nn_model.route, nn_model.direction)
    stopDf = nn_model.createStopDf()
    distances = nn_model.calculateDistances()
    print("STOP DF", stopDf.shape)
    
  
    #length = len(timeDf) + len(distances) + stopDf.shape[1] + 6
    #print('Num of cols', length)
    #df = pd.DataFrame(columns=[i for i in range(length)])
    

    time_df = get_time_and_date_df(selectedTime,selectedDate, nn_model,stopDf)
    weather_df = create_weather_df(rain, temp, stopDf, nn_model)
    index_to_insert_distances = 1    #distances has to go in middle of weather 
    weather_df.insert(loc=index_to_insert_distances, column='distance', value=distances)
    comined_df = pd.concat([weather_df, time_df,stopDf ], axis=1)
    # print ('combined df\n',comined_df )
    # print(comined_df.columns)
    x = comined_df.columns
    for i in x:
        print(i)

    # print(comined_df.shape[0])
    print(comined_df.head(5))
    print(comined_df.shape)
    # Implement this 
    # startStopArray = createStopArray(route, direction getNumStopsInJourney(start, finish, route, direction))
    # makePrediction(pklFileName)cs 
    nn_model.makePrediction(pkl, comined_df)
    return JsonResponse({'test': 'val'})


@api_view(['POST'])
def getMultiRoutePrediction(request):
    print("REQUEST", request.data)
    data = request.data['busRoutes']
    totalPrediction = 0
    route = data[0]['route']
    direction = 'I'
    startLat = str(round(decimal.Decimal(str(data[0]['start']['lat'])), 2))
    startLng = str(round(decimal.Decimal(str(data[0]['start']['lng'])), 2))
    # print(round(x,4))
    # print(round(y,5))
    print(startLat)
    print(startLng)
    # startStop = Composite.objects.filter(name=route).filter(route_direction = direction).filter(stop_lat = startLat).filter(stop_lon = startLng).values()
    # startStop = Composite.objects.filter(stop_lat = startLat).filter(stop_lon = startLng).values().filter(name = route).filter(route_direction = direction)
    # startStop = Composite.objects.filter(stop_lat = startLat).filter(stop_lon = startLng).filter(name = route).filter(route_direction = direction).values()
    startStop = Composite.objects.filter(stop_lat__regex=r'^{}.*$'.format(startLat)).filter(stop_lon__regex=r'^{}.*$'.format(startLng)).filter(name = route).filter(route_direction = direction).values()
    print(startStop)
    print(len(startStop))
    return JsonResponse({'test': 'val'})

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