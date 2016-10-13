from django.contrib.auth.models import User

from rest_framework import viewsets

from api.models import *
from api.serializers import *
from api.permissions import *
from api.filters import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (Or(IsAnonCreate, IsAuthenticated),)
    filter_backends = (IsAdminOrOwnerFilter,)


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (IsAdminOrOwnerFilter,)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
