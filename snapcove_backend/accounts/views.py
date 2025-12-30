from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from .serializers import SignupSerializer, UserSerializer, GoogleAuthSerializer
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.serializers import RefreshToken
from django.contrib.auth import authenticate
from .utils import send_otp

@method_decorator(csrf_exempt, name='dispatch')
class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        user.is_active = False
        user.save()

        send_email_otp(user)

        return Response("detail: OTP sent successfully", status=201)

class VerifyEmailOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        otp = EmailOTP.objects.filter(user=user, code=code, is_used=False).last()
        if not otp or not otp.is_valid():
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        otp.is_used = True
        otp.save()

        user.is_active = True
        user.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        })

        

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or password is None:
            return Response({'error': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        if not user.is_active:
            return Response({"error":"Account not verified"}, 403)

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
        # Frontend sends 'id_token', accept both for compatibility
        token = request.data.get('id_token') or request.data.get('token')

        if not token:
            return Response(
                {'error': 'Token not provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

        except ValueError as e:
            return Response(
                {'error': f'Invalid token: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Token verification failed: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        sub = idinfo.get("sub")
        email = idinfo.get("email")
        name = idinfo.get("name")
        picture = idinfo.get("picture")

        if not email:
            return Response(
                {'error': 'Email not provided by Google'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Try to find user by google_sub first
        user = User.objects.filter(google_sub=sub).first()

        # If not found, try to find by email
        if not user:
            user = User.objects.filter(email=email).first()
            if user:
                # Update existing user with Google info
                user.google_sub = sub
                user.auth_provider = "google"
                if name and not user.name:
                    user.name = name
                user.save()

        # Create new user if doesn't exist
        if not user:
            user = User.objects.create_user(
                email=email,
                password=None,  # Google users don't need passwords
                name=name or email.split('@')[0],
                auth_provider="google",
                google_sub=sub,
                role=None  # User will need to select role later
            )

        # if not email: 
        #     return Response(
        #         {'error': 'Email not provided by Google'}, 
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

        # user, created = User.objects.get_or_create(
        #     email=email,
        #     defaults={
        #         'name': name,
        #         'profile_picture': picture,
        #         'role': "Student",
        #     }
        # )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
            "needs_role_selection": user.role is None
        })

class SelectRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        role = request.data.get('role')
        
        if role not in ['admin', 'coordinator', 'photographer', 'student']:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.role is not None:
            return Response({'error': 'User already has a role'}, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.role = role
        request.user.save(update_fields=["role"])

        return Response(
            {"detail": "Role set successfully"},
            status=status.HTTP_200_OK
        )
           
