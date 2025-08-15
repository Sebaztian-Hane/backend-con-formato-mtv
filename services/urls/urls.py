from django.urls import path
from . import views

app_name = 'services'

urlpatterns = [
    path('user/role/', views.get_user_role, name='get_user_role'),
    path('user/permissions/', views.get_user_permissions, name='get_user_permissions'),
    path('user/assign-role/', views.assign_role_to_user, name='assign_role_to_user'),
] 