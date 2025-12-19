from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'

class IsCoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'coordinator'

class IsPhotographer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'photographer'

class HasSelf(BasePermission):
    def has_object_permission(self, request, view):
        return(
            request.user.is_authenticated and
            request.user.role is not None
        )