from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError("Email is required")
        if not username:
            raise ValueError("Username is required")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email)
        user.set_password(password)
        user.save()
        return user


class User(AbstractBaseUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)

    # REQUIRED by Django but you never need to use it
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = "email"       # login with email
    REQUIRED_FIELDS = ["username"] # needed only when creating superuser

    def __str__(self):
        return self.email
