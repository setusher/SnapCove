from rest_framework.routers import DefaultRouter    
from django.urls import path
from .views import PhotoViewSet, UserPhotosView, PhotoDetailView, TagUserView, TaggedPhotosView, PhotoSearchView

router = DefaultRouter()
router.register(r'events/(?P<event_id>\d+)/albums/(?P<album_id>\d+)/photos', PhotoViewSet, basename='album-photos')

urlpatterns = [
    path('photos/user/', UserPhotosView.as_view(), name='user-photos'),
    path("photos/<int:pk>/", PhotoDetailView.as_view(), name="photo-detail"),
    path("photos/<int:pk>/tag/", TagUserView.as_view()),
    path("photos/tagged/", TaggedPhotosView.as_view()),
    path("photos/search/", PhotoSearchView.as_view()),
    path("photos/<int:pk>/download/", PhotoDownloadView.as_view()),


] + router.urls
