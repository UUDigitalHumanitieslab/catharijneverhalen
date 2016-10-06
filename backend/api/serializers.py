"""
    Serializers for the REST API. See
    http://www.django-rest-framework.org/tutorial/1-serialization/
    for a detailed explanation of what's going on here.
"""

from rest_framework import serializers

from api.models import *


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = (
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
