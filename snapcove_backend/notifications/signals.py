from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from interactions.models import Comment, Like
from photos.models import Photo
from asgiref.sync import async_to_sync
from photos.models import PhotoTag
from channels.layers import get_channel_layer

def push_realtime(notification):
    if not notification.recipient_id:
        return

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
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
    # #region agent log
    import json
    import sys
    try:
        with open('/Users/shachithakur/Desktop/CODES/SnapCove/.cursor/debug.log', 'a') as f:
            f.write(json.dumps({
                "sessionId": "debug-session",
                "runId": "initial",
                "hypothesisId": "A",
                "location": "notifications/signals.py:30",
                "message": "Comment signal triggered",
                "data": {"comment_id": instance.id, "created": created, "parent_id": instance.parent_id, "photo_id": instance.photo.id if instance.photo else None},
                "timestamp": int(__import__('time').time() * 1000)
            }) + '\n')
    except Exception as e:
        print(f"Log error: {e}", file=sys.stderr)
    # #endregion
    
    if not created:
        return

    actor = instance.user
    
    if instance.parent_id:
        recipient = instance.parent.user
        # #region agent log
        try:
            with open('/Users/shachithakur/Desktop/CODES/SnapCove/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({
                    "sessionId": "debug-session",
                    "runId": "initial",
                    "hypothesisId": "B",
                    "location": "notifications/signals.py:48",
                    "message": "Reply notification - checking recipient",
                    "data": {"recipient_id": recipient.id if recipient else None, "actor_id": actor.id, "recipient_equals_actor": recipient == actor},
                    "timestamp": int(__import__('time').time() * 1000)
                }) + '\n')
        except: pass
        # #endregion
        
        if recipient and recipient != actor:
            try:
                notif = Notification.objects.create(
                    recipient=recipient,
                    actor=actor,
                    notification_type='reply',
                    comment=instance,
                    photo=instance.photo,  # Add photo field
                    message=f"{actor.name} replied to your comment",
                )
                push_realtime(notif)
                try:
                    with open('/Users/shachithakur/Desktop/CODES/SnapCove/.cursor/debug.log', 'a') as f:
                        f.write(json.dumps({
                            "sessionId": "debug-session",
                            "runId": "initial",
                            "hypothesisId": "C",
                            "location": "notifications/signals.py:62",
                            "message": "Reply notification created",
                            "data": {"notification_id": notif.id},
                            "timestamp": int(__import__('time').time() * 1000)
                        }) + '\n')
                except: pass
                # #endregion
            except Exception as e:
                # #region agent log
                try:
                    with open('/Users/shachithakur/Desktop/CODES/SnapCove/.cursor/debug.log', 'a') as f:
                        f.write(json.dumps({
                            "sessionId": "debug-session",
                            "runId": "initial",
                            "hypothesisId": "D",
                            "location": "notifications/signals.py:75",
                            "message": "Reply notification creation failed",
                            "data": {"error": str(e), "error_type": type(e).__name__},
                            "timestamp": int(__import__('time').time() * 1000)
                        }) + '\n')
                except: pass
                # #endregion
                print(f"Error creating reply notification: {e}", file=sys.stderr)
        
    else:
        recipient = instance.photo.uploaded_by
        # #region agent log
        try:
            with open('/Users/shachithakur/Desktop/CODES/SnapCove/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({
                    "sessionId": "debug-session",
                    "runId": "initial",
                    "hypothesisId": "E",
                    "location": "notifications/signals.py:87",
                    "message": "Comment notification - checking recipient",
                    "data": {"recipient_id": recipient.id if recipient else None, "actor_id": actor.id, "recipient_equals_actor": recipient == actor},
                    "timestamp": int(__import__('time').time() * 1000)
                }) + '\n')
        except: pass
        
        
        if recipient and recipient != actor:
            try:
                notif = Notification.objects.create(
                    recipient=recipient,
                    actor=actor,
                    notification_type='comment',
                    comment=instance,
                    photo=instance.photo,  
                    message=f"{actor.name} commented on your photo",
                )
                push_realtime(notif)
                
                try:
                    with open('/Users/shachithakur/Desktop/CODES/SnapCove/.cursor/debug.log', 'a') as f:
                        f.write(json.dumps({
                            "sessionId": "debug-session",
                            "runId": "initial",
                            "hypothesisId": "F",
                            "location": "notifications/signals.py:105",
                            "message": "Comment notification created",
                            "data": {"notification_id": notif.id},
                            "timestamp": int(__import__('time').time() * 1000)
                        }) + '\n')
                except: pass
              
            except Exception as e:
               
                try:
                    with open('/Users/shachithakur/Desktop/CODES/SnapCove/.cursor/debug.log', 'a') as f:
                        f.write(json.dumps({
                            "sessionId": "debug-session",
                            "runId": "initial",
                            "hypothesisId": "G",
                            "location": "notifications/signals.py:118",
                            "message": "Comment notification creation failed",
                            "data": {"error": str(e), "error_type": type(e).__name__},
                            "timestamp": int(__import__('time').time() * 1000)
                        }) + '\n')
                except: pass
               
                print(f"Error creating comment notification: {e}", file=sys.stderr)

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


    
