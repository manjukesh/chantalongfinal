from Slok import views
from django.conf.urls import url
from django.urls import path

urlpatterns = [
    url(r'^$', views.index),
    url('mantra', views.mantra),
    path("clips/<str:filename>/", views.mantra_audio),
]