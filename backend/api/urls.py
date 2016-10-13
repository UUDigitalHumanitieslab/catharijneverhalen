from django.conf.urls import url, include

from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'persons', views.PersonViewSet)

app_name = 'api'
urlpatterns = [
    url(r'^', include(router.urls)),
]
