from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL
class Notification(models.Model):

    NOTIFICATION_TYPES = [
        ('system', 'System'),
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('tag', 'Tag'),
        ('upload', 'Upload'),
        ('reply', 'Reply'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    recipient = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='notifications',
        null = True,
        blank = True,
    )

    actor = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='actor_notifications',
    )

    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
        default='system',
    )

    message = models.TextField()

    photo = models.ForeignKey(
        'photos.Photo', 
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    comment = models.ForeignKey(
        'interactions.Comment', 
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ['-created_at']
