from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Photo
from .serializers import PhotoSerializer
from events.models import Album

class PhotoViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Photo.objects.filter(album_id=self.kwargs['album_id'])
    
    def perform_create(self, serializer):
        album = Album.objects.get(id=self.kwargs['album_id'])
        serializer.save(
            uploaded_by=self.request.user,
            album=album
        )
    
