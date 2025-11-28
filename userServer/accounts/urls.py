from django.urls import path
from .views import register, login_view, profile, users_list
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register),
    path('login/', login_view),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', profile),
    path('users/', users_list),
]
