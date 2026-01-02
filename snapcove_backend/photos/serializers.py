from rest_framework import serializers
from .models import Photo
from accounts.serializers import UserMiniSerializer
from interactions.models import Like, Comment

class PhotoSerializer(serializers.ModelSerializer):
    uploaded_by = UserMiniSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    album_id = serializers.IntegerField(source="album.id", read_only=True)
    class Meta:
        model = Photo
        fields = '__all__'
        read_only_fields = ['id','album','uploaded_by','image','thumbnail','caption','tags',
            'width','height','camera_model','gps_location','capture_time',
            'exif_data','ai_tags','is_public','is_approved','processing_status',
            'uploaded_at','updated_at','likes_count','is_liked']

    def get_likes_count(self, obj):
        return Like.objects.filter(photo=obj).count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, photo=obj).exists()
        return False
