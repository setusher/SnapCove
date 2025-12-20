from rest_framework import serializers
from .models import Like, Comment 
from accounts.serializers import UserMiniSerializer

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'created_by', 'photo']
        read_only_fields = ['user', 'created_by']

class CommentSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    replies = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'photo', 'content', 'parent', 'created_at', 'replies']
        read_only_fields = ['user', 'replies', 'created_at']

    def get_replies(self, obj):
        replies = obj.replies.all().order_by('created_at')
        return CommentSerializer(replies, many=True).data
