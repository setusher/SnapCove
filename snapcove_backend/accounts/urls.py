from django.urls import path
from .views import SignUpView, LoginView, MeView, GoogleAuthView, SelectRoleView, VerifyOTPView, ResendOTPView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny


urlpatterns = [
    path("token/refresh/", TokenRefreshView.as_view()),
    path("login/", authentication_classes([])(permission_classes([AllowAny])(LoginView.as_view()))),
    path("signup/", authentication_classes([])(permission_classes([AllowAny])(SignUpView.as_view()))),
    path('me/', MeView.as_view()),
    path('google/', GoogleAuthView.as_view()),
    path('select-role/', SelectRoleView.as_view()),
    path("verify-otp/", VerifyOTPView.as_view()),
    path("resend-otp/", ResendOTPView.as_view()),


]