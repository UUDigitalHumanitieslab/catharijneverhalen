import datetime

from django.db import models
from django.core import validators
from django.contrib.auth.models import User


class Category(models.Model):
    """ Abstract base for models that represent category levels. """
    name = models.CharField(max_length=30, unique=True)
    
    class Meta():
        abstract = True
    
    def __str__(self):
        return self.name


class Person(models.Model):
    """ Person description similar to the approach in MCC AdLib. """
    
    GENDER_CHOICES = (
        (1, 'female'),
        (2, 'male'),
        (3, 'other'),
    )
    user = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        related_name='person',
        null=True,
    )
    name = models.CharField(blank=True, max_length=254)
    address_place = models.CharField(blank=True, max_length=126)
    birth_year = models.SmallIntegerField(null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    birth_place = models.CharField(blank=True, max_length=126)
    gender = models.SmallIntegerField(
        null=True, 
        blank=True,
        choices=GENDER_CHOICES,
    )
    nationality = models.CharField(blank=True, max_length=126)
    family_composition = models.TextField(blank=True)
    education_level = models.ForeignKey(
        'EducationLevel',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    occupation = models.CharField(blank=True, max_length=126)
    marital_status = models.ForeignKey(
        'MaritalStatus',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    religious_background = models.CharField(blank=True, max_length=126)
    portrait = models.ImageField(upload_to="portraits", blank=True)
    
    def __str__(self):
        return self.name
    
    def get_owner(self):
        return self.user


class EducationLevel(Category):
    """ Helper model for listing valid education levels. """


class MaritalStatus(Category):
    """ Helper model for listing valid education levels. """


class ParentOccupation(models.Model):
    """ Helper model for listing the parent occupations of a Person. """
    person = models.ForeignKey(
        'Person',
        on_delete=models.CASCADE,
        related_name='parent_occupations',
    )
    parent = models.ForeignKey(
        'Parent',
        on_delete=models.PROTECT,
    )
    occupation = models.CharField(max_length=126)
    
    def get_owner(self):
        return self.person.user


class Parent(Category):
    """ Helper model for listing valid parent types. """


class Story(models.Model):
    """ Story data, loosely modeled after Dublin Core. 
    
        Mapping of the Dublin Core terms.
        contributor:  `editors`
        coverage:     `place`, `year`, `year_end`
        creator:      `author`
        date:         `creation_date`, `edit.date for edit in edits`
        description:  `introduction`
        format:       `format`
        identifier:   REST API serializer .url
        language:     `language`
        publisher:    URL of the application
        relation:     not applicable
        rights:       to be determined by the museum
        source:       not applicable
        subject:      `subject`
        title:        `title`
        type:         personal memory involving the subject
    """
    
    # Dublin Core fields
    editors = models.ManyToManyField(
        'Person',
        through='StoryEdit',
        related_name='edited_stories',
    )
    place = models.CharField(blank=True, max_length=254)
    year = models.SmallIntegerField(null=True, blank=True)
    year_end = models.SmallIntegerField(null=True, blank=True)
    author = models.ForeignKey(
        'Person',
        on_delete=models.PROTECT,
        related_name='stories',
    )
    creation_date = models.DateTimeField(auto_now_add=True)
    introduction = models.TextField(blank=True)
    format = 'text/plain'
    language = 'NL'
    subject = models.URLField(blank=True, null=True, max_length=254)
    title = models.CharField(blank=True, max_length=254)
    content = models.TextField(blank=True)
    
    # additional fields
    last_checked_on = models.DateTimeField(blank=True, null=True)
    last_checked_by = models.ForeignKey(
        'Person',
        on_delete=models.PROTECT,
        blank=True,
        null=True,
    )
    
    class Meta:
        ordering = ('-creation_date',)
    
    def __str__(self):
        return self.title
    
    def get_owner(self):
        return self.author.user


class StoryEdit(models.Model):
    """ Supporting model for keeping track of Story edits. """
    story = models.ForeignKey(
        'Story',
        on_delete=models.CASCADE,
        related_name='edits',
    )
    date = models.DateTimeField(auto_now_add=True)
    editor = models.ForeignKey(
        'Person',
        on_delete=models.PROTECT,
        related_name='edits',
    )


class UrlStoryAttachment(models.Model):
    """ Supporting model for attaching remote media to Stories. """

    story = models.ForeignKey(
        'Story',
        on_delete=models.CASCADE,
        related_name='url_attachments',
    )
    attachment = models.URLField(max_length=254)
    
    def get_owner(self):
        return self.story.author.user


class ImageStoryAttachment(models.Model):
    """ Supporting model for attaching local images to Stories. """

    story = models.ForeignKey(
        'Story',
        on_delete=models.SET_NULL,
        related_name='image_attachments',
        null=True,
    )
    attachment = models.ImageField(upload_to="illustrations")
    
    def get_owner(self):
        return self.story.author.user
