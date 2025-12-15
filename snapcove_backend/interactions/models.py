from django.db import models
from django.conf import settings

class Like(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    photo = models.ForeignKey('photos.Photo', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Like {self.id} by {self.user.email} on {self.photo.id}"


class Comment(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    photo = models.ForeignKey('photos.Photo', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment {self.id} by {self.user.email} on {self.photo.id}"
