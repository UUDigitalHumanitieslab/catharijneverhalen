from django.db.models import Q
from django.contrib.auth.models import User

from rest_framework import filters


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


class IsPublishedOrAuthorFilter(filters.BaseFilterBackend):
    """ Ensure that a Story is either published or owned by the requester. """
    def filter_queryset(self, request, queryset, view):
        isPublished = Q(published=True)
        if request.user.is_authenticated():
            person = request.user.person
            isAuthor = Q(author=person)
            return queryset.filter(isPublished | isAuthor)
        else:
            return queryset.filter(isPublished)
