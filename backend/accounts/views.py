from django.contrib.auth import login, logout
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import User
from .seed import TEST_USERS


class TestUserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='get_full_name')

    class Meta:
        model = User
        fields = ['username', 'name', 'role']


# Only reachable when ENABLE_TEST_LOGIN is on (config/urls.py, docs 4.7).
@extend_schema(
    summary='Testna prijava bez OAuth-a (samo lokalni razvoj)',
    methods=['GET'],
    responses=TestUserSerializer(many=True),
)
@extend_schema(
    methods=['POST'],
    request=inline_serializer('TestLogin', {'username': serializers.CharField()}),
    responses=TestUserSerializer,
)
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def test_login(request):
    """GET lists the seeded test users; POST logs one in with a regular session."""
    # Only users from the seed list, so a real account can never be logged in this way.
    test_users = User.objects.filter(username__in=TEST_USERS, is_active=True).order_by('username')
    if request.method == 'GET':
        return Response(TestUserSerializer(test_users, many=True).data)

    user = test_users.filter(username=request.data.get('username')).first()
    if user is None:
        raise serializers.ValidationError(
            {'username': ['Nepoznat testni korisnik. Pokrenite python manage.py seed_test_users.']}
        )
    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
    return Response(TestUserSerializer(user).data)


# Just for development, logout_view is the real logout
@extend_schema(summary='Odjava testnog korisnika', request=None, responses={204: None})
@api_view(['POST'])
@permission_classes([AllowAny])
def test_logout(request):
    logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'role']  # company comes later


@extend_schema(summary='Prijavljeni korisnik', responses=CurrentUserSerializer)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """Not logged in: 401 (config.authentication.SessionAuthentication)."""
    return Response(CurrentUserSerializer(request.user).data)


@extend_schema(summary='Odjava', request=None, responses={204: None})
@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)  # flushes the session
    return Response(status=status.HTTP_204_NO_CONTENT)
