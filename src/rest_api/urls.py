from django.urls import path

from . import views

urlpatterns = [
    path('', views.getAllStops.as_view(), name='getAllStops'),
    path('getAllRoutes', views.getAllRoutes.as_view(), name='getAllRoutes'),
    path('getStopsForRoute', views.getStopsForRoute,
         name='getStopsForRoute'),
    # path('weather', views.getAllWeather.as_view(), name='getAllWeather'),
    # path('', views.getAllStops, name='getAllStops'),
    # path('testRequest', views.request, name='request'),
    path('getRouteStopComposite', views.getRouteStopComposite.as_view(),
         name="getRouteStopComposite"),
]
