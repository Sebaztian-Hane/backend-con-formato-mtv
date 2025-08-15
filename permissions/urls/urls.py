from django.urls import path
from . import views

app_name = 'permissions'

urlpatterns = [
    path('', views.permission_list, name='permission_list'),
    path('<int:pk>/', views.permission_detail, name='permission_detail'),
    path('create/', views.permission_create, name='permission_create'),
    path('<int:pk>/update/', views.permission_update, name='permission_update'),
    path('<int:pk>/delete/', views.permission_delete, name='permission_delete'),
] 