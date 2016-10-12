"""
    Serializers for the REST API. See
    http://www.django-rest-framework.org/tutorial/1-serialization/
    for a detailed explanation of what's going on here.
"""

from django.contrib.auth.models import User

from rest_framework import serializers

from api.models import *


class UserSerializer(serializers.HyperlinkedModelSerializer):
    person = serializers.HyperlinkedRelatedField(
        many=False,
        queryset=Person.objects.all(),
        view_name='api:person-detail',
    )
    url = serializers.HyperlinkedIdentityField(view_name='api:user-detail')

    class Meta:
        model = User
        fields = ('url', 'username', 'person')


class PersonSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    url = serializers.HyperlinkedIdentityField(view_name='api:person-detail')
    
    class Meta:
        model = Person
        fields = (
            'url',
            'user',
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
