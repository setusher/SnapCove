from django.db import models
from events.models import Event, Album
from django.conf import settings 

User = settings.AUTH_USER_MODEL

class Photo(models.Model):
    
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='photos')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='photos_uploaded')
 
    image = models.ImageField(upload_to='photos/')
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)

    caption = models.CharField(max_length=255, blank=True)
    tags = models.JSONField(default=list, blank=True)

    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    exif_data = models.JSONField(null=True, blank=True)
    camera_model = models.CharField(max_length=120, null=True, blank=True)
    gps_location = models.CharField(max_length=120, null=True, blank=True)
    capture_time = models.DateTimeField(null=True, blank=True)

    ai_tags = models.JSONField(default=list, blank=True)

    is_approved = models.BooleanField()
    is_public = models.BooleanField(default=True)

    processing_status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("processing", "Processing"),
            ("done", "Done"),
            ("failed", "Failed")
        ],
        default="pending"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Photo {self.id} "