from celery import shared_task
from photos.models import Photo
from photos.ai_pipeline import process_photo

@shared_task(name="photos.process_photo_task")
def process_photo_task(photo_id):
    print("TASK ENTERED FOR PHOTO", photo_id)

    photo = Photo.objects.get(id=photo_id)

    print("STARTING PIPELINE")
    process_photo(photo)
    print("PIPELINE COMPLETE")
