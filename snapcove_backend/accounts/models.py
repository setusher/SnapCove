from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self ,email, password=None, **extra_fields):
        if not email:
            raise ValueError('You have not provided an email')
        
        email = self.normalize_email(email)
        user = self.model(email=email,username=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('coordinator', 'EVent Coordinator'),
        ('photographer', 'Photographer'),
        ('student', 'Student'),
        
    )
    auth_provider = models.CharField(
        max_length = 50, 
        choices = [('google', 'google'), ('email', 'email')],
        default = 'email'
    )
    google_sub = models.CharField(
    max_length=255,
    blank=True,
    null=True,
    unique=True
    )

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='profiles/', blank = True, null = True)
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    
    batch = models.CharField(max_length = 10, blank = True, null = True)
    department = models.CharField(max_length = 50, blank = True, null = True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.email}-{self.role}"

