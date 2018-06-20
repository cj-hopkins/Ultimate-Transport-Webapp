from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.conf.urls.static import static
from .models import Stop
import random

def test(request):
    return HttpResponse("api working")

def request(request):
    return HttpResponse("request made")
