from datetime import datetime

from django.contrib.auth.models import User

from rest_framework import viewsets, throttling

from api.models import *
from api.serializers import *
from api.permissions import *
from api.filters import *


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
