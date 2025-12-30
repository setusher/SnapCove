import random
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from .models import EmailOTP, User

def send_otp(user):
    otp = str(random.randint(100000, 999999))

    EmailOTP.objects.create(
        user=user,
        code=otp,
        expires_at=timezone.now() + timedelta(minutes=10)
    )

    send_mail(
        "SnapCove Verification Code",
        f"Your SnapCove verification code is: {otp}",
        "noreply@snapcove.com",
        [user.email],
        fail_silently=False
    )
