# The Django-based backend

This Readme assumes Python version 3. Python 2 has not been tested.


## Basic installation

Create a database and user for the application. Write a python module that looks like this:

    from catharijne.settings import *  # unless you want to override everything
    
    # https://docs.djangoproject.com/en/1.9/ref/settings/#databases
    DATABASES = {...}
    
    # https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/
    SECRET_KEY = '...'
    ALLOWED_HOSTS = [...]
    MEDIA_ROOT = '...'

For now, assume that this module is called `settings.py`. It must be available from the PYTHONPATH.

Next, create a virtualenv and activate it. Then:

    pip install pip-tools  # at your option, also pip-review
    pip-sync
    python manage.py migrate --settings=settings
    python manage.py createsuperuser --settings=settings


## Running a test server

    python manage.py runserver --settings=settings
