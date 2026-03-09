from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .serializers import UserSerializer
from .models import User, PasswordReset

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

# Login existing user
class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # Check if user exists
        try:
            user_exists = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not registered"}, status=status.HTTP_404_NOT_FOUND)

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "username": user.username
        })


class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "No user found with this email"}, status=status.HTTP_404_NOT_FOUND)

        # Delete any existing unused tokens for this user
        PasswordReset.objects.filter(user=user, is_used=False).delete()

        # Create new reset token
        reset = PasswordReset.objects.create(user=user)

        # Send email with reset link
        reset_link = f"http://localhost:5173/reset-password?token={reset.token}"
        
        try:
            send_mail(
                subject="Password Reset Request",
                message=f"Hello {user.username},\n\nClick the link below to reset your password:\n{reset_link}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "Password reset link has been sent to your email",
            "token": reset.token  # For development/testing only - remove in production
        }, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token")
        new_password = request.data.get("password")

        if not token or not new_password:
            return Response({"error": "Token and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reset = PasswordReset.objects.get(token=token)
        except PasswordReset.DoesNotExist:
            return Response({"error": "Invalid reset token"}, status=status.HTTP_404_NOT_FOUND)

        # Check if token is valid
        if not reset.is_valid():
            return Response({"error": "Reset token has expired or already been used"}, status=status.HTTP_400_BAD_REQUEST)

        # Update password
        user = reset.user
        user.set_password(new_password)
        user.save()

        # Mark token as used
        reset.is_used = True
        reset.save()

        return Response({
            "message": "Password has been reset successfully"
        }, status=status.HTTP_200_OK)