from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from interactions.models import Comment, Like
from photos.models import Photo
from asgiref.sync import async_to_sync
from photos.models import PhotoTag
from channels.layers import get_channel_layer

#realtime pushing ke liye
def push_realtime(notification):
    #X reci-> skip
    if not notification.recipient_id:
        return
    #redis channel backend 
    channel_layer = get_channel_layer()
    #msg send to ws group
    async_to_sync(channel_layer.group_send)(
        #select group
        f"user_{notification.recipient_id}",
        {
            "type": "notify",
            "data": {
                "id": notification.id,
                "message": notification.message,
                "type": notification.notification_type,
                "photo": notification.photo_id,
                "created_at": notification.created_at.isoformat(),
            }
        }
    )



@receiver(post_save, sender=Like)
def notify_like(sender, instance, created, **kwargs):
    if not created:
        return
    
    photo = instance.photo
    recipient = photo.uploaded_by
    actor = instance.user

    #khud ko notify nahi karenge
    if not recipient or recipient == actor:
        return

    try:
        notif = Notification.objects.create(
            recipient=recipient,
            actor=actor,
            notification_type='like',
            photo=photo,
            message=f"{actor.name} liked your photo",
        )
        push_realtime(notif)
    except Exception as e:
        import sys
        print(f"Error creating like notification: {e}", file=sys.stderr)




@receiver(post_save, sender=Comment)
def notify_comment(sender, instance, created, **kwargs):
    if not created:
        return

    actor = instance.user

    # Reply to a comment
    if instance.parent_id:
        recipient = instance.parent.user

        if recipient and recipient != actor:
            notif = Notification.objects.create(
                recipient=recipient,
                actor=actor,
                notification_type='reply',
                comment=instance,
                photo=instance.photo,
                message=f"{actor.name} replied to your comment",
            )
            push_realtime(notif)

    # New comment 
    else:
        recipient = instance.photo.uploaded_by

        if recipient and recipient != actor:
            notif = Notification.objects.create(
                recipient=recipient,
                actor=actor,
                notification_type='comment',
                comment=instance,
                photo=instance.photo,
                message=f"{actor.name} commented on your photo",
            )
            push_realtime(notif)

@receiver(post_save, sender=Photo)
def notify_photo(sender, instance,created, **kwargs):
    if not created:
        return

    if instance.album and instance.album.event:
        event = instance.album.event
        if event.created_by != instance.uploaded_by:
            notif = Notification.objects.create(
                recipient=event.created_by,
                actor=instance.uploaded_by,
                notification_type='upload',
                photo=instance,
                message=f"{instance.uploaded_by.name} uploaded a new photo to the event {event.title}",
            )
            push_realtime(notif)

@receiver(post_save, sender=PhotoTag)
def notify_tag(sender, instance, created, **kwargs):
    if created:
        actor_name = instance.tagged_by.name if instance.tagged_by else "Someone"
        notif = Notification.objects.create(
            recipient=instance.user,
            actor=instance.tagged_by,
            photo=instance.photo,
            notification_type="tag",
            message=f"{actor_name} tagged you in the photo"
        )
        push_realtime(notif)


    
