from django.urls import path

from . import views

urlpatterns = [
    path('', views.getAllStops.as_view(), name='getAllStops'),
    # path('weather', views.getAllWeather.as_view(), name='getAllWeather'),
    # path('', views.getAllStops, name='getAllStops'),
    path('testRequest', views.request, name='request'),
]
