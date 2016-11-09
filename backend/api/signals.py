from django.db.models import signals
from django.dispatch import receiver
from django.contrib.auth.models import User

from api.models import Person, Story, StoryEdit


@receiver(signals.post_save, sender=User)
def attach_person(sender, **kwargs):
    if kwargs['created']:
        user = kwargs['instance']
        Person(user=user, name=user.username).save()
