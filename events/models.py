from django.db import models
from django.conf import settings

class Event(models.Model):
    title = models.CharField(max_length=255)
    description  = models.TextField(blank=True, null=True)

    cover_image = models.ImageField(upload_to='event_covers/', blank=True, null=True)

    start_date = models.DateField()
    end_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='events_created')

    is_public = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Album(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='albums')
    title = models.CharField(max_length=255)
    description  = models.TextField(blank=True, null=True)

    cover_image = models.ImageField(upload_to='album_covers/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    

    def __str__(self):
        return self.title
