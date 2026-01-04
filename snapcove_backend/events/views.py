# from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Event, Album
from .serializers import EventSerializer, AlbumSerializer
from accounts.permissions import IsCoordinator, IsAdmin, IsPhotographer
from .permissions import IsEventOwnerOrAdmin, IsEventOwnerOrAdminOrPhotographer
from rest_framework.filters import SearchFilter, OrderingFilter
from accounts.permissions import IsAlbumUploader

class EventViewSet(viewsets.ModelViewSet):
    filter_backends = [SearchFilter, OrderingFilter]
    filterset_fields = ['is_public', 'created_by']
    search_fields = ['title', 'description']
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [IsAlbumUploader()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsEventOwnerOrAdmin()]
        return [IsAuthenticated()]
        
        

    def get_queryset(self):
        user = self.request.user

        #logged in
        if user.is_authenticated:
            return Event.objects.all()
        
        #not logged in
        return Event.objects.filter(is_public=True)
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class AlbumViewSet(viewsets.ModelViewSet):
    serializer_class = AlbumSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]

    def get_permissions(self):
        if self.action == 'create':
            return [IsAlbumUploader()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsEventOwnerOrAdminOrPhotographer()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Album.objects.filter(event_id=self.kwargs['event_id'])

    def perform_create(self, serializer):
        event = Event.objects.get(id=self.kwargs['event_id'])
        serializer.save(
            created_by=self.request.user,
            event=event
        ) 


