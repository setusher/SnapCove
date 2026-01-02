from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status
from .models import Photo
from .serializers import PhotoSerializer
from events.models import Album
from accounts.permissions import IsCoordinator, IsAdmin
from rest_framework.generics import ListAPIView 
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404 
from rest_framework.filters import SearchFilter, OrderingFilter
from .tasks import process_photo_task
from celery import current_app

class PhotoViewSet(viewsets.ModelViewSet):
    fiterset_fields = ['album', 'is_approved']
    search_fields = ['caption', 'tags']
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]

    def get_queryset(self):
        return Photo.objects.filter(album_id=self.kwargs['album_id'])
    
    def perform_create(self, serializer):
        album = Album.objects.get(id=self.kwargs['album_id'])
        photo = serializer.save(
            uploaded_by=self.request.user,
            album=album
        )
        current_app.send_task("photos.process_photo_task", args=[photo.id])

class PendingPhotosView(ListAPIView):
    serializer_class = PhotoSerializer
    permission_classes = [IsCoordinator|IsAdmin]

    def get_queryset(self):
        return Photo.objects.filter(is_approved=False)

class ApprovePhotoView(APIView):
    permission_classes  = [IsCoordinator|IsAdmin]

    def post(self, request, pk):
        photo = get_object_or_404(Photo, pk=pk)
        photo.is_approved = True
        photo.save()
        return Response({'status': 'approved'})

class RejectPhotoView(APIView):
    permission_classes =  [IsCoordinator|IsAdmin]

    def post(self, request, pk):
        photo = get_object_or_404(Photo, pk=pk)
        photo.is_approved = False
        photo.save()
        return Response({'status': 'rejected'})

class UserPhotosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get('user_id', None)
        if user_id and (request.user.id == int(user_id) or request.user.role in ['admin', 'coordinator']):
            photos = Photo.objects.filter(uploaded_by_id=user_id, is_approved=True).order_by('-uploaded_at')
        else:
            photos = Photo.objects.filter(uploaded_by=request.user, is_approved=True).order_by('-uploaded_at')
        serializer = PhotoSerializer(photos, many=True, context={'request': request})
        return Response(serializer.data)

class PhotoDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        photo = get_object_or_404(Photo, pk=pk)
        serializer = PhotoSerializer(photo, context={'request': request})
        return Response(serializer.data)

    