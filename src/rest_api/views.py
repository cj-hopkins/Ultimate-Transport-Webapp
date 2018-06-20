from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.conf.urls.static import static
from django.core import serializers
from .models import Stop
from rest_framework.response import Response
import random
import json

def test(request):
    x = Stop.objects.all()
    data = serializers.serialize('json', x)
    return HttpResponse(data)

def request(request):
    return Response("request made")
