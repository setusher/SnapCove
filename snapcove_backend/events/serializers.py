from rest_framework import serializers
from .models import Event, Album
from accounts.serializers import UserMiniSerializer

class EventSerializer(serializers.ModelSerializer):
    created_by = UserMiniSerializer(read_only=True)
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['id','email', 'created_by','created_at', 'updated_at']

class AlbumSerializer(serializers.ModelSerializer):
    created_by = UserMiniSerializer(read_only=True)
    class Meta:
        model = Album
        fields = '__all__'
        read_only_fields = ['id','event','created_at', 'updated_at']