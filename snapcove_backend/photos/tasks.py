from celery import shared_task
from .models import Photo
from .ai_pipeline import process_photo

@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=30)
def process_photo_task(self, photo_id):
    photo = Photo.objects.get(id=photo_id)
    process_photo(photo)
