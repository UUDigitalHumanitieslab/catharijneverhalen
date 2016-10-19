from datetime import datetime

from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import viewsets, throttling, status
from rest_framework.decorators import list_route, api_view
from rest_framework.response import Response

from api.models import *
from api.serializers import *
from api.permissions import *
from api.filters import *


@ensure_csrf_cookie
@api_view(['GET', 'HEAD'])
def gettoken(request):
    return Response(status=status.HTTP_204_NO_CONTENT)


class CreateUserThrottle(throttling.UserRateThrottle):
    """ Restrictive rate to limit account creation DoS attacks. """
    rate = '10/day'


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (Or(IsAnonCreate, IsAuthenticated),)
    filter_backends = (IsAdminOrOwnerFilter,)
    throttle_classes = (CreateUserThrottle,)


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (IsAdminOrOwnerFilter,)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = (Or(ReadOnly, IsAdminUser, IsOwner),)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user.person)
    
    def perform_update(self, serializer):
        serializer.save(editor=self.request.user.person)


class UrlAttachmentViewSet(viewsets.ModelViewSet):
    queryset = UrlStoryAttachment.objects.all()
    serializer_class = UrlAttachmentSerializer
    permission_classes = (Or(ReadOnly, IsAdminUser, IsOwner),)
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(editor=self.request.user)


class ImageAttachmentViewSet(viewsets.ModelViewSet):
    queryset = ImageStoryAttachment.objects.all()
    serializer_class = ImageAttachmentSerializer
    permission_classes = (Or(ReadOnly, IsAdminUser, IsOwner),)
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(editor=self.request.user)
