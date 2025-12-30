from rest_framework import serializers
from .models import Like, Comment 
from accounts.serializers import UserSerializer

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'created_by', 'photo']
        read_only_fields = ['user', 'created_by']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'photo', 'content', 'parent', 'created_at', 'replies']
        read_only_fields = ['user', 'replies', 'created_at', 'photo']

    def get_replies(self, obj):
        replies = obj.replies.all().order_by('created_at')
        return CommentSerializer(replies, many=True).data
