from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Like, Comment
from .serializers import LikeSerializer, CommentSerializer

from photos.models import Photo

class ToggleLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, photo_id):
        photo = get_object_or_404(Photo, pk=photo_id)
        like, created = Like.objects.get_or_create(user=request.user, photo=photo)
        
        if not created:
            like.delete()
            return Response({'liked': False})
        
        return Response({'liked': True})

class LikesCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, photo_id):
        count = Like.objects.filter(photo_id=photo_id).count()
        return Response({'likes_count': count})

class CommentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, photo_id):
        comments = Comment.objects.filter(
            photo_id = photo_id,
            parent__isnull=True
        ).order_by('-created_at')

        serializer = CommentSerializer(comments, many=True)

        return Response(serializer.data)

    def post(self, request, photo_id):
        photo = get_object_or_404(Photo, pk=photo_id)
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(
            photo = photo,
            user = request.user
        )

        return Response(serializer.data, status=201)

class ReplyCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id):
        comment = get_object_or_404(Comment, pk=comment_id)
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # parent_comment = Comment.objects.get(id=parent_id)
        

        serializer.save(
            photo=comment.photo,
            user = request.user,
            parent = comment
        )

        return Response(serializer.data, status=201)

class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        comment = get_object_or_404(Comment, pk=comment_id)
        if comment.user != request.user:
            return Response({'error': 'Not Allowed'},status=403)
        comment.delete()
        return Response(status=204)

