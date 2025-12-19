from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from .serializers import SignupSerializer, UserSerializer, GoogleAuthSerializer
from .models import User

from rest_framework_simplejwt.serializers import RefreshToken
from django.contrib.auth import authenticate


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': serializer.data,
            'message': 'User created successfully',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or password is None:
            return Response({'error': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Login successful'
        })

class MeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class GoogleAuthView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['id_token']

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

        except ValueError:
            return Response(
                {'error': 'Invalid token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        email = idinfo.get("email")
        name = idinfo.get("name")
        picture = idinfo.get("picture")

        if not email: 
            return Response(
                {'error': 'Email not provided by Google'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'name': name,
                'profile_picture': picture,
                'role': "Student",
            }
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role
            }
        })
