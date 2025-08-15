from django.urls import path
from . import views

app_name = 'roles'

urlpatterns = [
    path('', views.role_list, name='role_list'),
    path('<int:pk>/', views.role_detail, name='role_detail'),
    path('create/', views.role_create, name='role_create'),
    path('<int:pk>/update/', views.role_update, name='role_update'),
    path('<int:pk>/delete/', views.role_delete, name='role_delete'),
] 