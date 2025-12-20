from django.urls import path
from .views import LikesCountView, ToggleLikeView, CommentListCreateView, ReplyCommentView, CommentDeleteView

urlpatterns = [
    path('/photos/<int:photo_id>/likes-count/', LikesCountView.as_view()),
    path('/photos/<int:photo_id>/toggle-like/', ToggleLikeView.as_view()),
    path('/photos/<int:photo_id>/comments/', CommentListCreateView.as_view()),
    path('/comments/<int:photo_id>/comments/<int:comment_id>/reply/', ReplyCommentView.as_view()),
    path('/comments/<int:comment_id>/delete/', CommentDeleteView.as_view()),
]
