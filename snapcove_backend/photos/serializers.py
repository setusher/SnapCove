from rest_framework import serializers
from .models import Photo
from accounts.serializers import UserMiniSerializer
from interactions.models import Like, Comment

class PhotoSerializer(serializers.ModelSerializer):
    uploaded_by = UserMiniSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    album_id = serializers.IntegerField(source="album.id", read_only=True)
    event_id = serializers.IntegerField(source="album.event.id", read_only=True)

    class Meta:
        model = Photo
        fields = [
            'id','album','album_id','event_id','uploaded_by',
            'image','thumbnail','caption','tags',
            'width','height','camera_model','gps_location','capture_time',
            'exif_data','ai_tags','is_public','is_approved','processing_status',
            'uploaded_at','updated_at','likes_count','is_liked'
        ]
        extra_kwargs = {
            'album': {'required': False},
            'is_public': {'required': False},
            'is_approved': {'required': False},
        }
        read_only_fields = ['uploaded_by','processing_status','thumbnail']
    def get_likes_count(self, obj):
        return Like.objects.filter(photo=obj).count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, photo=obj).exists()
        return False
