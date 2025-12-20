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

class HasSelectedRole(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated or not request.user:
            return True

        if view.__class__.__name__ in [
            'SelectRoleView',
            'LoginView',
            'SignUpView',
            'GoogleAuthView'
        ]      