from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.conf.urls.static import static
from django.core import serializers
from .models import Stop, Route, Composite, Currentweather, FiveDayWeather
from .serializers import StopSerializer, RouteSerializer, RouteStopSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
#from braces.views import CsrfExemptMixin
import random
import json
import re
from rest_api.get_prediction import getPrediction, rf_model
import pandas as pd
import numpy as np 
import datetime

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
def getPredictionForJourney(request):
    route = request.data.get('route')
    start = request.data.get('start')
    finish = request.data.get('finish')
    direction = request.data.get('direction')
    selectedTime = request.data.get('selectedTime')
    selectedDate = request.data.get('selectedDate')
    isDefaultTime = request.data.get('isDefaultTime')
    print(type(isDefaultTime))
    numStops = getNumStopsInJourney(start, finish, route, direction)
    if numStops == -1:
        print("indexing failed")
    if isDefaultTime:
        isRaining = getRainNow()
        result = getPrediction(numStops, isRaining, selectedTime)
        print(result[0])
        return JsonResponse({'prediction':result[0]})
    else:
        isRaining = getRainNotNow(selectedTime,selectedDate )
        result = getPrediction(numStops, isRaining, selectedTime)
        print(result[0])
        return JsonResponse({'prediction':str(result[0])+ 'NOT NOW!'})

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

def getRainNow():
    regex = r'^.*[R|r]ain.*$'
    weather = Currentweather.objects.values()[0]
    isRaining = re.match(regex, weather['description'])
    isRaining = False if isRaining is None else True
    return isRaining
  
def getRainNotNow(chosenTime, chosenDate):
    regex = r'^.*[R|r]ain.*$'
    future_weather = FiveDayWeather.objects.values()
    relevant_weather= get_temp_and_rain(future_weather ,chosenTime, chosenDate )
    isRaining = re.match(regex, relevant_weather['description'])
    isRaining = False if isRaining is None else True
    return isRaining
  
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
    
  
  