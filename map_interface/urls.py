from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('db/', views.dbTest, name='dbTest')
]
