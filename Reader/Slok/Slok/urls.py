from Slok import views
from django.conf.urls import url
from django.urls import path

def okay(request):
    return HttpResponse('pretend-binary-data-here', content_type='image/jpeg')

urlpatterns = [
    path('favicon.ico', okay),
    url(r'^$', views.index),
    url('mantra', views.mantra),
    path("clips/<str:filename>/", views.mantra_audio),
]
