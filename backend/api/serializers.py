"""
    Serializers for the REST API. See
    http://www.django-rest-framework.org/tutorial/1-serialization/
    for a detailed explanation of what's going on here.
"""

from django.contrib.auth.models import User

from rest_framework import serializers

from api.models import *


class UserSerializer(serializers.ModelSerializer):
    persons = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Person.objects.all(),
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'persons')


class PersonSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Person
        fields = (
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
