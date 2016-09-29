from django.db import models
from django.core import validators


class Category(models.Model):
    """ Abstract base for models that represent category levels. """
    name = models.CharField(max_length=30)
    
    class Meta():
        abstract = True


class Person(models.Model):
    """ Person description similar to the approach in MCC AdLib. """
    GENDER_CHOICES = (
        (1, 'female'),
        (2, 'male'),
        (3, 'other'),
    )
    name = models.CharField(blank=True, max_length=254)
    address_place = models.CharField(blank=True, max_length=126)
    birth_year = models.SmallIntegerField(null=True, blank=True, validators=[
        validators.MinValueValidator(-2000),
        validators.MaxValueValidator(2017),
    ])
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
    portrait = models.ImageField(upload_to="portraits")


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


class Parent(Category):
    """ Helper model for listing valid parent types. """
