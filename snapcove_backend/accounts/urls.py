from django.urls import path
from .views import SignUpView, LoginView, MeView

urlpatterns = [
    path('signup/', SignUpView.as_view()),
    path('login/', LoginView.as_view()),
    path('me/', MeView.as_view()),
]