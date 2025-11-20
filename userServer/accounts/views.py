from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

# Helper function to generate JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)

    # Return JWT tokens immediately
    tokens = get_tokens_for_user(user)

    return Response({
        "message": "User created successfully",
        "username": user.username,
        "user_id": user.id,
        **tokens
    }, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({"error": "Invalid username or password"}, status=400)

    tokens = get_tokens_for_user(user)

    return Response({
        "message": "Login successful",
        "username": user.username,
        "user_id": user.id,
        **tokens
    }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list(request):
    users = User.objects.exclude(id=request.user.id)
    return Response([{"id": u.id, "username": u.username} for u in users])

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    # JWT is stateless; frontend should delete tokens
    return Response({"message": "Logged out successfully"}, status=200)
