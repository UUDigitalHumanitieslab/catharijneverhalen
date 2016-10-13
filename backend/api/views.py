from django.conf import settings
from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from api.models import *
from api.serializers import *
from api.permissions import *
from api.filters import *


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('api:user-list', request=request, format=format),
        'persons': reverse('api:person-list', request=request, format=format)
    })


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (Or(IsAnonCreate, IsAuthenticated),)
    filter_backends = (IsAdminOrOwnerFilter,)


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (IsAdminOrOwnerFilter,)


class PersonList(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (IsAdminOrOwnerFilter,)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PersonDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (IsAdminOrOwnerFilter,)
