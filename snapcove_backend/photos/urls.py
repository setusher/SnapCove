from rest_framework.routers import DefaultRouter    
from django.urls import path
from .views import PhotoViewSet, UserPhotosView, PhotoDetailView

router = DefaultRouter()
router.register(r'events/(?P<event_id>\d+)/albums/(?P<album_id>\d+)/photos', PhotoViewSet, basename='album-photos')

urlpatterns = [
    path('photos/user/', UserPhotosView.as_view(), name='user-photos'),
    path("photos/<int:pk>/", PhotoDetailView.as_view(), name="photo-detail"),

] + router.urls
