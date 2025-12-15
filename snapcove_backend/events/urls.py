from rest_framework.routers import DefaultRouter
from .views import EventViewSet, AlbumViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'events/(?P<event_id>\d+)/albums', AlbumViewSet, basename='event-album')

urlpatterns = router.urls