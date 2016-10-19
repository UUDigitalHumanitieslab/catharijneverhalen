from django.conf.urls import url, include

from rest_framework.routers import DefaultRouter

from api import views

router = DefaultRouter(schema_title='Catharijneverhalen API')
router.register(r'users', views.UserViewSet)
router.register(r'persons', views.PersonViewSet)
router.register(r'stories', views.StoryViewSet)
router.register(r'url-attachments', views.UrlAttachmentViewSet)
router.register(r'image-attachments', views.ImageAttachmentViewSet)

app_name = 'api'
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^gettoken/$', views.gettoken),
]
