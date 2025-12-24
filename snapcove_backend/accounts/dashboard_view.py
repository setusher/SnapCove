from rest_framework.views import APIView
rom rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from .permissions import IsAdmin, IsCoordinator, IsPhotographer
from .models import User
from events.models import Event, Album
from photos.models import Photo
from interactions.models import Like, Comment
from notifications.models import Notification

class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        total_users = User.object.count()
        users_by_role = User.objects.values('role').annotate(count=Count('id'))
        recent_users = User.objects.order_by('-date_joined')[:5].values
