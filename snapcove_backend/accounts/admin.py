from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    ordering = ['email']
    list_display = ['email', 'name', 'role', 'is_active', 'is_staff', 'is_superuser']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'batch', 'department', 'profile_picture')}),
        ('Roles & Permissions', {'fields': ('role','is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email','name', 'password1', 'password2'),
            },
        )
    )

admin.site.register(User, UserAdmin)