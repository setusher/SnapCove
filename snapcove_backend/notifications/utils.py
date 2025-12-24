from .models import Notification

def notify_photo_status(photo, status, reason=None):
    if not photo.uploaded_by:
        return None:
    
    if status == 'approved':
        return Notification.objects.create(
            recipient=photo.uploaded_by,
            notification_type='approved',
            photo=photo,
            message=f"Your photo was approved",
        )
    
    elif status == 'rejected':
        return Notification.objects.create(
            recipient=photo.uploaded_by,
            notification_type='rejected',
            photo=photo,
            message=f"Your photo was rejected",
        )

    return None