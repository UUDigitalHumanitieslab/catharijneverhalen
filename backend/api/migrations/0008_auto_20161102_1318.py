# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-11-02 12:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20161025_1335'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='story',
            options={'ordering': ('-creation_date',)},
        ),
    ]
