from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status
from .models import Photo
from .serializers import PhotoSerializer, BulkPhotoSerializer
from events.models import Album
from accounts.permissions import IsCoordinator, IsAdmin
from rest_framework.generics import ListAPIView 
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404 
from rest_framework.filters import SearchFilter, OrderingFilter
from .tasks import process_photo_task
from celery import current_app
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser
from accounts.permissions import IsPhotoUploader
from rest_framework.decorators import action
from .models import PhotoTag
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination

class PhotoViewSet(viewsets.ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)
    fiterset_fields = ['album', 'is_approved']
    search_fields = ['caption']
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]

    def get_queryset(self):
        queryset = Photo.objects.filter(album_id=self.kwargs['album_id'])
        
        # Filter by tag if provided
        tag_filter = self.request.query_params.get('tag', None)
        if tag_filter:
            # For PostgreSQL JSONField with list, use contains operator
            # This searches for the tag string in the tags array
            queryset = queryset.filter(tags__contains=[tag_filter])
        
        return queryset
    
    def get_permissions(self):
        if self.action in ['create', 'bulk_upload']:
            self.permission_classes = [IsPhotoUploader]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        album = Album.objects.get(id=self.kwargs['album_id'])
        photo = serializer.save(uploaded_by=self.request.user, album=album)

        transaction.on_commit(lambda: current_app.send_task(
        "photos.process_photo_task", args=[photo.id]
        ))

    @action(detail=False, methods=["post"], url_path="bulk")
    def bulk_upload(self, request, event_id = None, album_id = None):
        serializer = BulkPhotoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        files = serializer.validated_data['files']
        caption = serializer.validated_data.get("caption","")
        tags = serializer.validated_data.get("tags",[])

        album = Album.objects.get(id=album_id)
        created = []

        for file in files:
            photo = Photo.objects.create(
                uploaded_by=request.user,
                album=album,
                image=file,
                caption=caption,
                tags=tags
            )
            created.append(photo.id)

            transaction.on_commit(lambda pid=photo.id:
                current_app.send_task("photos.process_photo_task", args=[pid])
            )

        return Response({"uploaded": created}, status=201)
        

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

class TagUserView(APIView):
    permissions_classes = [IsPhotoUploader]
    def post(self, request, pk):
        from accounts.models import User
        
        user_id = request.data.get("user_id")
        email = request.data.get("email")
        
        # Support both user_id and email
        if email:
            try:
                user = User.objects.get(email=email)
                user_id = user.id
            except User.DoesNotExist:
                return Response({"error": f"User with email {email} not found"}, status=404)
        elif not user_id:
            return Response({"error": "Either user_id or email must be provided"}, status=400)
        
        tag = PhotoTag.objects.create(
            photo_id=pk,
            user_id=user_id,
            tagged_by=request.user
        )
        return Response({"status": "tagged"})
    
class TaggedPhotosView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tags = PhotoTag.objects.filter(user=request.user)
        photos = Photo.objects.filter(id__in=tags.values_list("photo_id", flat=True))
        return Response(PhotoSerializer(photos, many=True, context={"request": request}).data)

class PhotoSearchPagination(PageNumberPagination):
    page_size = 24

class PhotoSearchView(ListAPIView):
    serializer_class = PhotoSerializer
    pagination_class = PhotoSearchPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Photo.objects.filter(is_approved=True)

        q = self.request.query_params.get("q")
        tag = self.request.query_params.get("tag")
        photographer = self.request.query_params.get("photographer")
        event = self.request.query_params.get("event")
        album = self.request.query_params.get("album")
        from_date = self.request.query_params.get("from")
        to_date = self.request.query_params.get("to")

        if q:
            qs = qs.filter(
                Q(caption__icontains=q) |
                Q(tags__icontains=q) |
                Q(album__title__icontains=q) |
                Q(album__event__title__icontains=q)
            )

        if tag:
            qs = qs.filter(tagged_users__username__icontains=tag)

        if photographer:
            qs = qs.filter(uploaded_by_id=photographer)

        if event:
            qs = qs.filter(album__event_id=event)

        if album:
            qs = qs.filter(album_id=album)

        if from_date:
            qs = qs.filter(uploaded_at__date__gte=from_date)

        if to_date:
            qs = qs.filter(uploaded_at__date__lte=to_date)

        return qs.order_by("-uploaded_at").distinct()