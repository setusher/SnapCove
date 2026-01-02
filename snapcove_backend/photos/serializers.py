from rest_framework import serializers
from .models import Photo
from accounts.serializers import UserMiniSerializer
from interactions.models import Like, Comment

class PhotoSerializer(serializers.ModelSerializer):
    uploaded_by = UserMiniSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = '__all__'
        read_only_fields = ['id', 'uploaded_by', 'processing_status','created_at', 'updated_at', 'album','ai_tags','camera_model','gps_location','processing_status']

    def get_likes_count(self, obj):
        return Like.objects.filter(photo=obj).count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, photo=obj).exists()
        return False
