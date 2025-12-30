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
        serializer.save(
            uploaded_by=self.request.user,
            album=album
        )

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
    
