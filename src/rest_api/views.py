from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.conf.urls.static import static
from django.core import serializers
from .models import Stop, Route, Composite, Currentweather
from .serializers import StopSerializer, RouteSerializer, RouteStopSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
#from braces.views import CsrfExemptMixin
import random
import json
from rest_api.get_prediction import getPrediction, rf_model

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


# @csrf_exempt
@api_view(['POST'])
def getStopsForRoute(request):
    route = request.data.get('route')
    direction = request.data.get('direction')
    stops = Composite.objects.filter(name=route).filter(route_direction=direction).order_by('sequence_number')
    # stops = Composite.objects.filter(name=route).order_by('sequence_number')
    data = list(stops.values('stop_id', 'stop_lat', 'stop_lon', 'location_text', 'address', 'route_direction').distinct())
    # iDirection = [i for i in data if i['route_direction'] == 'I']
    # oDirection = [i for i in data if i['route_direction'] == 'O']
    print(data)
    return Response(data)
    # return JsonResponse({"iDirection": iDirection, "oDirection": oDirection})

@api_view(['POST'])
def getPredictionForJourney(request):
    route = request.data.get('route')
    start = request.data.get('start')
    finish = request.data.get('finish')
    stopNumber = request.data.get('stopNumber')
    print(route, start, finish)
    # stops = Composite.objects.filter(name=route).filter(route_direction=direction).order_by('sequence_number')
    # data = list(stops.values('stop_id', 'stop_lat', 'stop_lon', 'location_text', 'address').distinct())
    result = getPrediction()
    print(result[0])
    return JsonResponse({'prediction':result[0]})

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
