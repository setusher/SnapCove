from rest_framework.routers import DefaultRouter    
from django.urls import path
from .views import PhotoViewSet, UserPhotosView

router = DefaultRouter()
router.register(r'events/(?P<event_id>\d+)/albums/(?P<album_id>\d+)/photos', PhotoViewSet, basename='album-photos')

urlpatterns = [
    path('photos/user/', UserPhotosView.as_view(), name='user-photos'),
    path("photos/<int:pk>/", PhotoViewSet.as_view({'get': 'retrieve'})),

] + router.urls
