from django.urls import path
from .views import SignUpView, LoginView, MeView, GoogleAuthView

urlpatterns = [
    path('signup/', SignUpView.as_view()),
    path('login/', LoginView.as_view()),
    path('me/', MeView.as_view()),
    path('google/', GoogleAuthView.as_view()),
]