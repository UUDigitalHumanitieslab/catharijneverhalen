# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-10-14 11:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='educationlevel',
            name='name',
            field=models.CharField(max_length=30, unique=True),
        ),
        migrations.AlterField(
            model_name='maritalstatus',
            name='name',
            field=models.CharField(max_length=30, unique=True),
        ),
        migrations.AlterField(
            model_name='parent',
            name='name',
            field=models.CharField(max_length=30, unique=True),
        ),
    ]
