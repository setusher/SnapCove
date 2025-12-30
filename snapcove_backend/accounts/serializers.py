from rest_framework import serializers
from .models import User

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'role', 'batch', 'department']
        extra_kwargs = {
            'role': {'required': False, 'allow_null': True, 'allow_blank': True},
            'batch': {'required': False, 'allow_null': True, 'allow_blank': True},
            'department': {'required': False, 'allow_null': True, 'allow_blank': True},
            'name': {'required': True},
            'email': {'required': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        # Filter out None/empty values for optional fields
        cleaned_data = {}
        for k, v in validated_data.items():
            if v is not None and v != '':
                cleaned_data[k] = v
        
        user = User.objects.create_user(password=password, **cleaned_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'batch', 'department', 'profile_picture']

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']    

class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField()