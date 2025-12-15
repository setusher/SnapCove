from rest_framework.routers import DefaultRouter    
from .views import PhotoViewSet

router = DefaultRouter()
router.register(r'events/(?P<event_id>\d+)/albums/(?P<album_id>\d+)/photos', PhotoViewSet, basename='album-photos')

urlpatterns = router.urls
