from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    # User views
    UserDetailView, UserUpdateView, UserProfilePhotoView, UserSearchView, UserProfileView,
    # Profile views
    ProfileDetailView, ProfileCreateView, PublicProfileView, 
    ProfileSettingsView, ProfileCompletionView, ProfileSearchView,
    # Password views
    PasswordChangeView, PasswordResetView, PasswordResetConfirmView, 
    PasswordStrengthView, PasswordHistoryView, PasswordPolicyView,
    # Verification views
    VerificationCodeView, EmailChangeView, EmailChangeConfirmView, 
    VerificationCodeResendView, VerificationStatusView, EmailVerificationView, 
    EmailVerificationConfirmView
)

# Create router for viewsets
router = DefaultRouter()

# User URLs
urlpatterns = [
    # User management
    path('users/me/', UserDetailView.as_view(), name='user-detail'),
    path('users/me/update/', UserUpdateView.as_view(), name='user-update'),
    path('users/me/photo/', UserProfilePhotoView.as_view(), name='user-photo'),
    path('users/search/', UserSearchView.as_view(), name='user-search'),
    path('users/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Profile management
    path('profiles/me/', ProfileDetailView.as_view(), name='profile-detail'),
    path('profiles/create/', ProfileCreateView.as_view(), name='profile-create'),
    path('profiles/public/<str:username>/', PublicProfileView.as_view(), name='public-profile'),
    path('profiles/settings/', ProfileSettingsView.as_view(), name='profile-settings'),
    path('profiles/completion/', ProfileCompletionView.as_view(), name='profile-completion'),
    path('profiles/search/', ProfileSearchView.as_view(), name='profile-search'),
    
    # Password management
    path('password/change/', PasswordChangeView.as_view(), name='password-change'),
    path('password/reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('password/strength/', PasswordStrengthView.as_view(), name='password-strength'),
    path('password/history/', PasswordHistoryView.as_view(), name='password-history'),
    path('password/policy/', PasswordPolicyView.as_view(), name='password-policy'),
    
    # Verification management
    path('verification/code/', VerificationCodeView.as_view(), name='verification-code'),
    path('verification/email/change/', EmailChangeView.as_view(), name='email-change'),
    path('verification/email/change/confirm/', EmailChangeConfirmView.as_view(), name='email-change-confirm'),
    path('verification/code/resend/', VerificationCodeResendView.as_view(), name='verification-resend'),
    path('verification/status/', VerificationStatusView.as_view(), name='verification-status'),
    path('verification/email/', EmailVerificationView.as_view(), name='email-verification'),
    path('verification/email/confirm/', EmailVerificationConfirmView.as_view(), name='email-verification-confirm'),
]
