from datetime import datetime

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import viewsets, throttling, status
from rest_framework.decorators import detail_route
from rest_framework.response import Response

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
    permission_classes = (
        Or(ReadOnly, IsAdminUser, IsOwner(owner_field='author')),
    )
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user.person)
    
    def perform_update(self, serializer):
        serializer.save(editor=self.request.user.person)
    
    @detail_route(methods=('GET', 'POST', 'DELETE'), url_path='url_attachments/(?P<ua_id>[0-9]+)')
    def url_attachments(self, request, pk, ua_id=None):
        if ua_id is None:
            if request.method is 'GET':
                story = self.get_object()
                queryset = UrlStoryAttachment.objects.filter(story=story)
                serializer = UrlAttachmentSerializer(queryset, many=True)
                return Response(serializer.data)
            elif request.method is 'POST':
                serializer = UrlAttachmentSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save(story=story)
                    return Response(serializer.data)
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                return Response(
                    {'detail': 'Cannot delete full list.'},
                    status=status.HTTP_405_METHOD_NOT_ALLOWED,
                )
        else:  # ua_id is not None
            try:
                attachment = UrlStoryAttachment.objects.get(id=ua_id)
            except ObjectDoesNotExist:
                return Response(
                    {'detail': 'Object not found.'},
                    status=status.HTTP_404_NOT_FOUND,
                )
            if request.method is 'GET':
                serializer = UrlAttachmentSerializer(attachment)
                return Response(serializer.data)
            elif request.method is 'DELETE':
                attachment.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(
                    {'detail': 'Cannot create subattachments.'},
                    status=status.HTTP_405_METHOD_NOT_ALLOWED,
                )


class UrlAttachmentViewSet(viewsets.ModelViewSet):
    queryset