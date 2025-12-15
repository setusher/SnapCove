from rest_framework import serializers
from .models import Event, Album

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['id','created_by','created_at', 'updated_at']

class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'
        read_only_fields = ['id','event','created_by','created_at', 'updated_at']