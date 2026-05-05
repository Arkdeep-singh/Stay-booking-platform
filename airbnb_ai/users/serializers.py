from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "role")
        read_only_fields = ("id",)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True, required=False)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default="GUEST")
    
    class Meta:
        model = User
        fields = ("username", "email", "password", "password2", "first_name", "last_name", "role")
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        if data.get('password') != data.get('password2'):
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        # remove password2 before user creation
        validated_data.pop('password2', None)
        role = validated_data.pop('role', "GUEST")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role=role
        )
        return user