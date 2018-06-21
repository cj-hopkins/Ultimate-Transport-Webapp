from django.urls import path

from . import views

urlpatterns = [
    path('', views.getAllStops.as_view(), name='getAllStops'),
    # path('', views.getAllStops, name='getAllStops'),
    path('testRequest', views.request, name='request'),
]
