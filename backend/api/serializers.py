"""
    Serializers for the REST API. See
    http://www.django-rest-framework.org/tutorial/1-serialization/
    for a detailed explanation of what's going on here.
"""

from django.contrib.auth.models import User

from rest_framework import serializers, exceptions
from rest_framework.reverse import reverse

import six

from api.models import *


class FieldFilterMixin(object):
    """ Mixin for serializers to allow field selection at instantiation time."""
    def filter_fields(self, parent, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        parent.__init__(*args, **kwargs)
        if fields is not None:
            requested = set(fields)
            present = set(self.fields.keys())
            for field_name in present - requested:
                self.fields.pop(field_name)


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


class EditSerializer(FieldFilterMixin, serializers.HyperlinkedModelSerializer):
    """ Serializer meant for embedding into Story and Person serializers. """
    username = serializers.ReadOnlyField(source='editor.user.username')
    
    class Meta:
        model = StoryEdit
        fields = ('story', 'date', 'editor', 'username')
        extra_kwargs = {
            'story': {'view_name': 'api:story-detail'},
            'editor': {'view_name': 'api:person-detail'},
        }
    
    def __init__(self, *args, **kwargs):
        self.filter_fields(super(EditSerializer, self), *args, **kwargs)


class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = ('pk', 'name')


class EducationLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationLevel
        fields = ('pk', 'name')


class MaritalStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaritalStatus
        fields = ('pk', 'name')


class ParentOccupationSerializer(serializers.ModelSerializer):
    """ Serializer meant standalone and for embedding into PersonSerializer. """
    parent = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Parent.objects.all(),
    )
    
    class Meta:
        model = ParentOccupation
        fields = ('pk', 'parent', 'occupation')


class DisplayChoiceField(serializers.ChoiceField):
    """ Fixed ChoiceField that actually uses the display values. """
    
    def __init__(self, choices, **kwargs):
        super(DisplayChoiceField, self).__init__(choices, **kwargs)
        self.reverse_choices = {
            six.text_type(value): key for (key, value) in self.choices.items()
        }
    
    def to_internal_value(self, data):
        if data == '' and self.allow_blank:
            return ''
        text_data = six.text_type(data)
        if text_data in self.choice_strings_to_values:
            return self.choice_strings_to_values[text_data]
        if text_data in self.reverse_choices:
            return self.reverse_choices[text_data]
        self.fail('invalid_choice', input=data)
    
    def to_representation(self, value):
        if value in (None, ''):
            return value
        return self.choices[value]


class PersonSerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    gender = DisplayChoiceField(
        allow_null=True,
        choices=Person.GENDER_CHOICES,
        required=False,
    )
    parent_occupations = ParentOccupationSerializer(many=True, read_only=True)
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
    edits = EditSerializer(
        many=True,
        read_only=True,
        fields=('story', 'date'),
    )
    
    class Meta:
        model = Person
        fields = (
            'url',
            'user',
            'username',
            'name',
            'address_place',
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
            'stories',
            'edits',
        )
        extra_kwargs = {
            'url': {'view_name': 'api:person-detail'},
            'user': {'view_name': 'api:user-detail', 'read_only': True},
            'stories': {'view_name': 'api:story-detail', 'read_only': True},
        }


class AttachmentSerializer(
    FieldFilterMixin,
    serializers.HyperlinkedModelSerializer,
):
    """ Base class for both types of attachment serializers. """

    def __init__(self, *args, **kwargs):
        self.filter_fields(
            super(AttachmentSerializer, self),
            *args,
            **kwargs
        )
    
    def create(self, data):
        creator = data.pop('creator')
        # Check whether the referenced story is owned by the creator.
        # Using permissions or querysets for this purpose is virtually
        # impossible, so we do it here, in the serializer.
        if creator.is_staff or (data['story'].get_owner() == creator):
            return super(AttachmentSerializer, self).create(data)
        raise exceptions.PermissionDenied(
            detail='Story is not owned by current user.',
        )
    
    def update(self, instance, data):
        editor = data.pop('editor')
        # Check whether the referenced story is owned by the editor.
        # Using permissions or querysets for this purpose is virtually
        # impossible, so we do it here, in the serializer.
        if editor.is_staff or (data['story'].get_owner() == editor):
            return super(AttachmentSerializer, self).update(instance, data)
        raise exceptions.PermissionDenied(
            detail='Story is not owned by current user.',
        )


class UrlAttachmentSerializer(AttachmentSerializer):
    """ Serializer meant standalone and for embedding into StorySerializer. """
    class Meta:
        model = UrlStoryAttachment
        fields = ('pk', 'story', 'attachment')
        extra_kwargs = {
            'story': {'view_name': 'api:story-detail'},
        }


class ImageAttachmentSerializer(AttachmentSerializer):
    """ Serializer meant standalone and for embedding into StorySerializer. """
    class Meta:
        model = ImageStoryAttachment
        fields = ('pk', 'story', 'attachment')
        extra_kwargs = {
            'story': {'view_name': 'api:story-detail'},
        }


class StorySerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.ReadOnlyField(source='author.user.username')
    url_attachments = UrlAttachmentSerializer(
        many=True,
        read_only=True,
        fields=('pk', 'attachment'),
    )
    image_attachments = ImageAttachmentSerializer(
        many=True,
        read_only=True,
        fields=('pk', 'attachment'),
    )
    edits = EditSerializer(
        many=True,
        read_only=True,
        fields=('date', 'editor', 'username'),
    )
    
    class Meta:
        model = Story
        fields = (
            'url',
            'pk',
            'place',
            'year',
            'year_end',
            'author',
            'username',
            'creation_date',
            'introduction',
            'format',
            'language',
            'subject',
            'title',
            'content',
            'published',
            'url_attachments',
            'image_attachments',
            'edits',
        )
        extra_kwargs = {
            'url': {'view_name': 'api:story-detail'},
            'author': {'view_name': 'api:person-detail', 'read_only': True},
        }
    
    def update(self, instance, data):
        editor = data.pop('editor')
        StoryEdit.objects.create(story=instance, editor=editor)
        return super(StorySerializer, self).update(instance, data)
