import random
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from .models import User

def send_email_otp_raw(email, otp):
    send_mail(
        subject="SnapCove Email Verification",
        message=f"Your SnapCove verification code is: {otp}",
        from_email="SnapCove <snapcove.noreply@gmail.com>",
        recipient_list=[email],
        fail_silently=False
    )
