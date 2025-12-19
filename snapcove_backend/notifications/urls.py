from django.urls import path
from .views import (
    NotificationListView,
    MarkNotificationReadView,
    MarkAllReadView,
    UnreadCountView
)

urlpatterns = [
    path('', NotificationListView.as_view()),
    path('<int:pk>/read/', MarkNotificationReadView.as_view()),
    path('read-all/', MarkAllReadView.as_view()),
    path('unread-count/', UnreadCountView.as_view()),
]
