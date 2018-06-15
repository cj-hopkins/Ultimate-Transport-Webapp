from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.conf.urls.static import static
from .models import Stop

def index(request):
    return render(request, 'map_interface/index.html')

def dbTest(request):
    return HttpResponse(Stop.objects.all())
    # return HttpResponse("test")

