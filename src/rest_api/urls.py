from django.urls import path

from . import views

urlpatterns = [
    path('', views.getAllStops.as_view(), name='getAllStops'),
    path('getAllRoutes', views.getAllRoutes.as_view(), name='getAllRoutes'),
    path('getStopsForRoute', views.getStopsForRoute,
         name='getStopsForRoute'),
    path('getCurrentWeather', views.getCurrentWeather, name='getCurrentWeather'),
    path('getRouteStopComposite', views.getRouteStopComposite.as_view(),
         name="getRouteStopComposite"),
   path('getFiveDayWeather', views.getFiveDayWeather, name='getFiveDayWeather'),
   path('getMultiRoutePrediction', views.getMultiRoutePrediction, name='getMultiRoutePrediction'),
   path('getAllStopNumbers', views.getAllStopNumbers, name='getAllStopNumbers'),
   path('getTimeTable', views.getTimeTable, name='getTimeTable'),
   path('getModelPrediction', views.getModelPrediction, name='getModelPrediction'),
]
