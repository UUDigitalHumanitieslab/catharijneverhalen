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
