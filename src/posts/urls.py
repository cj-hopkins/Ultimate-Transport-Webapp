from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('db/', views.dbTest, name='dbTest'),
    path('extend/', views.extend, name='extend'),
    path('use_template/', views.use_template, name='use_template'),
]
