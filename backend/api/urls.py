from django.conf.urls import url, include

from rest_framework.routers import DefaultRouter

from api import views

router = DefaultRouter(schema_title='Catharijneverhalen API')
router.register(r'users', views.UserViewSet)
router.register(r'persons', views.PersonViewSet)
router.register(r'stories', views.StoryViewSet)

app_name = 'api'
urlpatterns = [
    url(r'^', include(router.urls)),
]
