from rest_framework import permissions

class AllowAll(permissions.BasePermission):
    def has_permission(self, request, view):
        return True  # Lo puedes personalizar como Laravel's `authorize()`
