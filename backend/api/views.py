from django.http import HttpResponse
from django.conf import settings


def google_maps_api_key(request):
    return HttpResponse(settings.GOOGLE_MAPS_API_KEY)
