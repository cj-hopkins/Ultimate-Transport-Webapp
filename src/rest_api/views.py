from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.conf.urls.static import static
from django.core import serializers
from .models import Stop
from .serializers import StopSerializer
from rest_framework.response import Response
from rest_framework import generics
import random
import json

class getAllStops(generics.ListCreateAPIView):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer

# class getAllWeather


# def getAllStops(request):
#     data = Stop.objects.values()
#     data = serializers.serialize('json', data)
#     print(type(data))
#     return HttpResponse(data, content_type="application/json")

def request(request):
    return Response("request made")
