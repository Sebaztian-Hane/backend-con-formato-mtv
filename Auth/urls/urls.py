from django.urls import path
from Auth.views.login_view import LoginView
from Auth.views.register import RegisterView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
]