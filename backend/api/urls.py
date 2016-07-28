from django.conf.urls import url

from . import views

app_name = 'api'
urlpatterns = [
    url(r'^gmapikey', views.google_maps_api_key, name='gmapikey'),
]
