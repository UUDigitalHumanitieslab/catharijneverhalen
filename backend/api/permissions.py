import inspect

from rest_framework import permissions


class PermissionFix(object):
    """
        This class addresses a shortcoming in permissions.BasePermission.
        
        Use as a mixin, to ensure that a Permission class defaults to
        the has_permission method when there is no special object
        permission method. Should be the first parent class.
    """
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsAdminUser(PermissionFix, permissions.IsAdminUser):
    """ Fixed version of IsAdminUser. """
    pass


class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object.
    Assumes the model instance has a `user` or `person` attribute.
    """
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'person'):
            return obj.person.user == request.user
        raise TypeError('{} model is not associated with a user or person'.format(type(obj).__name__))


class ReadOnly(permissions.BasePermission):
    """ Always allow read operations, never allow modifying operations. """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS


# Logic below was inspired on
# https://github.com/caxap/rest_condition/blob/7d0f251ce24a5869f63317b2945643d03ab0c221/rest_condition/permissions.py


def _is_factory(obj):
    return inspect.isclass(obj) or inspect.isfunction(obj)


class Or(permissions.BasePermission):
    """
    Provides a simple way to define composite permissions where only
    one of the operands needs to accept.
    Example of usage:
    >>> composed = Or(Perm1, Perm2, Perm3)
    """
    
    def __init__(self, *perms):
        self.perms = [perm() if _is_factory(perm) else perm for perm in perms]

    def evaluate_permissions(self, method, *args, **kwargs):
        return any((getattr(p, method)(*args, **kwargs) for p in self.perms))

    def has_object_permission(self, request, view, obj):
        return self.evaluate_permissions(
            'has_object_permission',
            request,
            view,
            obj,
        )

    def has_permission(self, request, view):
        return self.evaluate_permissions('has_permission', request, view)

    def __call__(self):
        return self
