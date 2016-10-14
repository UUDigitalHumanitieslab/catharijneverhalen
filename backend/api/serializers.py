"""
    Serializers for the REST API. See
    http://www.django-rest-framework.org/tutorial/1-serialization/
    for a detailed explanation of what's going on here.
"""

from django.contrib.auth.models import User

from rest_framework import serializers

from api.models import *


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'password', 'person')
        extra_kwargs = {
            'url': {'view_name': 'api:user-detail'},
            'password': {'write_only': True},
            'person': {'view_name': 'api:person-detail', 'read_only': True},
        }
    
    def create(self, data):
        user = User.objects.create(
            username=data['username'],
            email=data['email'],
        )
        user.set_password(data['password'])
        user.save()
        return user


class PersonSerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Person
        fields = (
            'url',
            'user',
            'username',
            'name',
            'address_place',
            'birth_year',
            'birth_date',
            'birth_place',
            'gender',
            'nationality',
            'family_composition',
            'occupation',
            'religious_background',
        )
        extra_kwargs = {
            'url': {'view_name': 'api:person-detail'},
            'user': {'view_name': 'api:user-detail', 'read_only': True},
        }
