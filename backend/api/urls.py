from django.conf.urls import url

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

app_name = 'api'
urlpatterns = format_suffix_patterns([
    url(r'^$', views.api_root),
    url(r'^users/$', views.UserList.as_view(), name='user-list'),
    url(
        r'^users/(?P<pk>[0-9]+)/$',
        views.UserDetail.as_view(),
        name='user-detail',
    ),
    url(r'^persons/$', views.PersonList.as_view(), name='person-list'),
    url(
        r'^persons/(?P<pk>[0-9]+)/$',
        views.PersonDetail.as_view(),
        name='person-detail',
    ),
])
