from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.conf.urls.static import static
from django.core import serializers
from .models import Stop, Route, Composite
from .serializers import StopSerializer, RouteSerializer, RouteStopSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
#from braces.views import CsrfExemptMixin
import random
import json

class getAllStops(generics.ListCreateAPIView):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer

class getAllRoutes(generics.ListCreateAPIView):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class getRouteStopComposite(generics.ListCreateAPIView):
    queryset = Composite.objects.all()
    serializer_class = RouteStopSerializer

# @csrf_exempt
@api_view(['POST'])
def getStopsForRoute(request):
    route = request.data.get('route')
    direction = request.data.get('direction')
    stops = Composite.objects.filter(name=route).filter(route_direction=direction).order_by('sequence_number')
    data = list(stops.values('stop_id', 'stop_lat', 'stop_lon', 'location_text', 'address').distinct())
    return Response(data)

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
