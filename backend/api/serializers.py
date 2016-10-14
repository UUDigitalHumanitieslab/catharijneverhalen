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


class ParentOccupationSerializer(serializers.ModelSerializer):
    """ Serializer meant for embedding into PersonSerializer. """
    parent = serializers.SlugRelatedField(
        slug_field='name',
        queryset=ParentOccupation.objects.all(),
    )
    
    class Meta:
        model = ParentOccupation
        fields = ('parent', 'occupation')


class PersonSerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    parent_occupations = ParentOccupationSerializer(many=True)
    education_level = serializers.SlugRelatedField(
        slug_field='name',
        queryset=EducationLevel.objects.all(),
        allow_null=True,
    )
    marital_status = serializers.SlugRelatedField(
        slug_field='name',
        queryset=MaritalStatus.objects.all(),
        allow_null=True,
    )
    
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
            'parent_occupations',
            'education_level',
            'occupation',
            'marital_status',
            'religious_background',
            'portrait',
        )
        extra_kwargs = {
            'url': {'view_name': 'api:person-detail'},
            'user': {'view_name': 'api:user-detail', 'read_only': True},
        }
    
    def create(self, data):
        parent_occupations_data = data.pop('parent_occupations')
        person = super(PersonSerializer, self).create(data)
        for parent_occupation in parent_occupations_data:
            ParentOccupation.objects.create(person=person, **parent_occupation)
        return person
