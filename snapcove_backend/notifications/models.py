from django.db import models
from django.conf import settings

class Notification(models.Model):

    NOTIFICATION_TYPES = [
        ('system', 'System'),
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('tag', 'Tag'),
        ('upload', 'Upload'),
    ]

    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='system')
    photo = models.ForeignKey("photos.Photo",null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.notification_type} Notification for {self.user.email}"
