from rest_framework import serializers
from .models import Photo
from accounts.serializers import UserMiniSerializer

class PhotoSerializer(serializers.ModelSerializer):
    uploaded_by = UserMiniSerializer(read_only=True)

    class Meta:
        model = Photo
        fields = '__all__'
        read_only_fields = ['id', 'uploaded_by', 'processing_status','created_at', 'updated_at', 'album']
    
