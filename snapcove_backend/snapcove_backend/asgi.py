import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from notifications.routing import websocket_urlpatterns
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.authentication import JWTAuthentication
from urllib.parse import parse_qs

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "snapcove_backend.settings")

django_asgi_app = get_asgi_application()


class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query = parse_qs(scope["query_string"].decode())
        token = query.get("token")

        if token:
            try:
                validated = JWTAuthentication().get_validated_token(token[0])
                scope["user"] = JWTAuthentication().get_user(validated)
            except Exception:
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        close_old_connections()
        return await self.app(scope, receive, send)


application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})
