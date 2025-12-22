from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from interactions.models import Comment, Like
from photos.models import Photo

@receiver(post_save, sender=Like)
def notify_like(sender, instance,created, **kwargs):
    if not created:
        return
    
    photo = instance.photo
    recipient = photo.uploaded_by
    actor = instance.user

    if recipient == actor:
        return

    Notification.objects.create(
        recipient=recipient,
        actor=actor,
        notification_type='like',
        photo=photo,
        message=f"{actor.name} liked your photo",
    )


@receiver(post_save, sender=Comment)
def notify_comment(sender, instance,created, **kwargs):
    if not created:
        return

    actor = instance.user
    
    if instance.parent:
        recipient = instance.parent.user
        if recipient != actor:
            Notification.objects.create(
                recipient=recipient,
                actor=actor,
                notification_type='reply',
                comment = instance,
                message=f"{actor.name} replied to your comment",
            )
        
    else:
        recipient = instance.photo.uploaded_by
        if recipient != actor:
            Notification.objects.create(
                recipient=recipient,
                actor=actor,
                notification_type='comment',
                comment = instance,
                message=f"{actor.name} commented on your photo",
            )

@receiver(post_save, sender=Photo)
def notify_photo(sender, instance,created, **kwargs):
    if not created:
        return

    if instance.album and instance.album.event:
        event = instance.album.event
        if event.created_by != instance.uploaded_by:
            Notification.objects.create(
                recipient=event.created_by,
                actor=instance.uploaded_by,
                notification_type='upload',
                photo=instance,
                message=f"{instance.uploaded_by.name} uploaded a new photo to the event {event.title}",
            )