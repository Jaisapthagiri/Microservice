from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import register, profile, users_list, login_view

urlpatterns = [
    path('admin/', admin.site.urls),

    # Register
    path('register/', register),

    # Custom Login (JWT tokens issued here)
    path('login/', login_view, name='login'),

    # Refresh Token
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile endpoint
    path('profile/', profile),

    # List of users
    path('users/', users_list),
]
