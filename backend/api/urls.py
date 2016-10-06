from django.conf.urls import url

from . import views

app_name = 'api'
urlpatterns = [
    url(r'^persons/$', views.PersonList.as_view()),
    url(r'^persons/(?P<pk>[0-9]+)/$', views.PersonDetail.as_view()),
]
