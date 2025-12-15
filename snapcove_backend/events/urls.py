from rest_framework.routers import DefaultRouter
from .views import EventViewSet, AlbumViewSet

router = DefaultRouter()
router.register(r'', EventViewSet, basename='event')
router.register(r'albums', AlbumViewSet, basename='album')

urlpatterns = router.urls