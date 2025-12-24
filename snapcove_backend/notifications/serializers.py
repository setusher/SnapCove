from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    actor_detail = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()
    class Meta:
        model = Notification
        fields = [
            'id',
            'message',
            'created_at',
            'is_read',
            'notification_type',
            'photo',
            'actor',
            'comment',
            'photo_url',
            'actor_detail',
        ]

    def get_actor_detail(self,obj):
        if not obj.actor:
            return None
        return {
            "id": obj.actor.id,
            "name": obj.actor.name,
            "profile_picture": obj.actor.profile_picture.url if obj.actor.profile_picture else None,
        }

    def get_photo_url(self,obj):
        if obj.photo and obj.photo.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.image.url)
            return obj.photo.image.url
        return None