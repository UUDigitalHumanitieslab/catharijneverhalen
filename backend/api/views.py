from django.conf import settings
from django.contrib.auth.models import User

from rest_framework import generics

from api.models import *
from api.serializers import *
from api.permissions import *


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAdminUser,)


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (Or(IsOwner, IsAdminUser),)


class PersonList(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = (IsAdminUser,)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PersonDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = (Or(IsOwner, IsAdminUser),)
