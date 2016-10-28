from datetime import datetime

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import viewsets, throttling, status, mixins
from rest_framework.decorators import list_route, api_view
from rest_framework.decorators import throttle_classes, permission_classes
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


@api_view(['POST'])
@throttle_classes((CreateUserThrottle,))
@permission_classes((IsAnonCreate,))
def create_user(request):
    """ Manual view instead of UserViewSet.create because of throttling. """
    serializer = UserSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        user = authenticate(
            username=request.data['username'],
            password=request.data['password'],
        )
        login(request, user)
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(
    # This list basically means "a ModelViewSet without model creation".
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (Or(ReadOnly, IsAnonCreate, IsAuthenticated),)
    filter_backends = (IsAdminOrOwnerFilter,)
    
    @list_route(methods=['get'])
    def identity(self, request):
        user = request.user
        if user.is_authenticated():
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @list_route(methods=['post'])
    def login(self, request):
        try:
            username = request.data['username']
        except KeyError as e:
            return Response({
                'username': 'Failed to provide a username.',
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            password = request.data['password']
        except KeyError as e:
            return Response({
                'password': 'Failed to provide a password.',
            }, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({
                'detail': 'Credentials did not match an existing account.',
            }, status=status.HTTP_401_UNAUTHORIZED)
        elif user.is_active:
            login(request, user)
            return Response(self.get_serializer(user).data)
        return Response({
            'detail': 'Account has been disabled',
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    @list_route(methods=['post'])
    def logout(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


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
