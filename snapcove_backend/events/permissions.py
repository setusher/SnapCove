from rest_framework.permissions import BasePermission

class IsEventOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.created_by or request.user.role == 'admin'

class IsEventOwnerOrAdminOrPhotographer(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.created_by or request.user.role == 'admin' or request.user.role == 'photographer'

