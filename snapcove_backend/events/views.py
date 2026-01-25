# from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Event, Album
from .serializers import EventSerializer, AlbumSerializer
from accounts.permissions import IsCoordinator, IsAdmin, IsPhotographer
from .permissions import IsEventOwnerOrAdmin, IsEventOwnerOrAdminOrPhotographer
from rest_framework.filters import SearchFilter, OrderingFilter
from accounts.permissions import IsAlbumUploader
from django.db.models import Q

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
            queryset = Event.objects.all()
        else:
            queryset = Event.objects.filter(is_public=True)
        
        # Date filtering
        from_date = self.request.query_params.get('from_date', None)
        to_date = self.request.query_params.get('to_date', None)
        date_filter = self.request.query_params.get('date', None)
        
        if date_filter:
            # Filter by exact date (matches start_date or end_date or created_at)
            queryset = queryset.filter(
                Q(start_date=date_filter) |
                Q(end_date=date_filter) |
                Q(created_at__date=date_filter)
            )
        else:
            if from_date:
                queryset = queryset.filter(
                    Q(start_date__gte=from_date) |
                    Q(end_date__gte=from_date) |
                    Q(created_at__date__gte=from_date)
                )
            if to_date:
                queryset = queryset.filter(
                    Q(start_date__lte=to_date) |
                    Q(end_date__lte=to_date) |
                    Q(created_at__date__lte=to_date)
                )
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class AlbumViewSet(viewsets.ModelViewSet):
    serializer_class = AlbumSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description']

    def get_permissions(self):
        if self.action == 'create':
            return [IsAlbumUploader()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsEventOwnerOrAdminOrPhotographer()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Album.objects.filter(event_id=self.kwargs['event_id'])
        
        # Date filtering
        from_date = self.request.query_params.get('from_date', None)
        to_date = self.request.query_params.get('to_date', None)
        date_filter = self.request.query_params.get('date', None)
        
        if date_filter:
            queryset = queryset.filter(created_at__date=date_filter)
        else:
            if from_date:
                queryset = queryset.filter(created_at__date__gte=from_date)
            if to_date:
                queryset = queryset.filter(created_at__date__lte=to_date)
        
        return queryset

    def perform_create(self, serializer):
        event = Event.objects.get(id=self.kwargs['event_id'])
        serializer.save(
            created_by=self.request.user,
            event=event
        ) 


