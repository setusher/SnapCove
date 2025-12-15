# from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Event, Album
from serializers import EventSerializer, AlbumSerializer

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        #logged in
        if user.is_authenticated:
            return Event.objects.all()
        
        #not logged in
        return Event.objects.filter(is_public=True)
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


