from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from .serializers import SignupSerializer, UserSerializer, GoogleAuthSerializer
from .models import User, PendingSignup
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.serializers import RefreshToken
from django.contrib.auth import authenticate
from .utils import send_email_otp_raw
import random
from datetime import timedelta
from django.utils import timezone
from django.db.models import Q

@method_decorator(csrf_exempt, name='dispatch')
class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        existing = PendingSignup.objects.filter(email=email).first()

        if existing:
            if timezone.now() < existing.expires_at:
                return Response({"error":"OTP already sent"}, 400)
            else:
                existing.delete()


        otp = str(random.randint(100000, 999999))

        PendingSignup.objects.create(
            email=email,
            name=request.data.get("name"),
            password=request.data.get("password"),
            role=request.data.get("role"),
            batch=request.data.get("batch"),
            department=request.data.get("department"),
            otp=otp,
            expires_at=timezone.now() + timedelta(minutes=10)
        )

        send_email_otp_raw(email, otp)

        return Response({"needs_verification": True}, status=201)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        pending = PendingSignup.objects.filter(email=email, otp=otp).first()

        if not pending or timezone.now() > pending.expires_at:
            return Response({"error":"Invalid OTP"},400)

        user = User.objects.create_user(
            email=pending.email,
            password=pending.password,
            name=pending.name,
            role=pending.role or "student",
            batch=pending.batch,
            department=pending.department,
        )

        pending.delete()

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
        # if not user.is_active:
        #     return Response({"error":"Account not verified"}, 403)

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

      
        user = User.objects.filter(google_sub=sub).first()

       
        if not user:
            user = User.objects.filter(email=email).first()
            if user:
                
                user.google_sub = sub
                user.auth_provider = "google"
                if name and not user.name:
                    user.name = name
                user.save()

       
        if not user:
            user = User.objects.create_user(
                email=email,
                password=None,  
                name=name or email.split('@')[0],
                auth_provider="google",
                google_sub=sub,
                role="student"
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

class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        pending = PendingSignup.objects.filter(email=email).first()

        if not pending:
            return Response({"error":"No pending signup"}, 404)

        otp = str(random.randint(100000,999999))
        pending.otp = otp
        pending.expires_at = timezone.now() + timedelta(minutes=10)
        pending.save()

        send_email_otp_raw(email, otp)

        return Response({"success": True})

class UserSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        
        if not query or len(query) < 2:
            return Response([])
        
        # Search by email or name
        users = User.objects.filter(
            Q(email__icontains=query) | Q(name__icontains=query)
        )[:10]  # Limit to 10 results
        
        serializer = UserSerializer(users, many=True, context={'request': request})
        return Response(serializer.data)

