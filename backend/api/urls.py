from django.conf.urls import url

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

app_name = 'api'
urlpatterns = format_suffix_patterns([
    url(r'^users/$', views.UserList.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'^persons/$', views.PersonList.as_view()),
    url(r'^persons/(?P<pk>[0-9]+)/$', views.PersonDetail.as_view()),
])
