from django.contrib.auth.models import User

from rest_framework import filters

from api.models import *


class IsAdminOrOwnerFilter(filters.BaseFilterBackend):
    """
        Filter backend for restricting visibility to owners and admins.
    """
    def filter_queryset(self, request, queryset, view):
        user = request.user
        if not user.is_authenticated():
            return queryset.none()
        if user.is_staff:
            return queryset
        model = view.get_serializer().Meta.model
        if model == User:
            return queryset.filter(id=user.id)
        if hasattr(model, 'user'):
            return queryset.filter(user=user)
        if hasattr(model, 'person'):
            return queryset.filter(person__user=user)
        return queryset.none()
