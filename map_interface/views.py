from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.conf.urls.static import static

def index(request):
    return render(request, 'map_interface/index.html')
