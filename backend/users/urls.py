# users/urls.py
from django.urls import path
from .views import RegisterView, LoginView, RequestPasswordResetView, ResetPasswordView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("password-reset/request/", RequestPasswordResetView.as_view(), name="request_password_reset"),
    path("password-reset/reset/", ResetPasswordView.as_view(), name="reset_password"),
]