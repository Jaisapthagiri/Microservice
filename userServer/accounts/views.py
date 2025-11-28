from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import User
from .serializers import RegisterSerializer, UserSerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    user = serializer.save()
    tokens = get_tokens_for_user(user)

    return Response({
        "message": "User created successfully",
        "user_id": user.id,
        "email": user.email,
        "username": user.username,
        **tokens
    }, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password required"}, status=400)

    user = authenticate(email=email, password=password)

    if not user:
        return Response({"error": "Invalid email or password"}, status=400)

    tokens = get_tokens_for_user(user)

    return Response({
        "message": "Login successful",
        "user_id": user.id,
        "email": user.email,
        "username": user.username,
        **tokens
    }, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return Response(UserSerializer(request.user).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list(request):
    users = User.objects.exclude(id=request.user.id)
    return Response(UserSerializer(users, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    # JWT is stateless; frontend should delete tokens
    return Response({"message": "Logged out successfully"}, status=200)
