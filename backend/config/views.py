import logging

from django.conf import settings
from django.db import DatabaseError, connection
from django.http import HttpResponse
from django.views.decorators.cache import cache_control, never_cache
from django.views.static import serve
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

logger = logging.getLogger(__name__)


@extend_schema(
    summary='Provjera rada API-ja i baze',
    responses=inline_serializer(
        'Health', {'status': serializers.CharField(), 'database': serializers.CharField()}
    ),
)
@never_cache
@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    """Public health check: confirms the API is running and the database answers."""
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
            cursor.fetchone()
    except DatabaseError:
        logger.exception('Health check: database unavailable')
        return Response({'status': 'error', 'database': 'unavailable'}, status=503)
    return Response({'status': 'ok', 'database': 'ok'})


@extend_schema(exclude=True)
@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def api_not_found(request, path):
    """Unknown /api/ paths answer in the API error format instead of Django's HTML 404 page."""
    raise NotFound


def media(request, path):
    """Serve an uploaded file from MEDIA_ROOT (vessel photos).

    WhiteNoise cannot serve files uploaded after startup. serve() rejects paths outside
    MEDIA_ROOT, and SECURE_CONTENT_TYPE_NOSNIFF stops browsers from treating a file as another type.
    """
    return serve(request, path, document_root=settings.MEDIA_ROOT)


@cache_control(no_cache=True)
def spa_index(request):
    """Return the built React index.html; React handles client-side routing."""
    index_file = settings.FRONTEND_DIST_DIR / 'index.html'
    try:
        return HttpResponse(index_file.read_bytes(), content_type='text/html')
    except FileNotFoundError:
        return HttpResponse(
            'Frontend build not found. Run "npm run build" in the frontend directory.',
            status=503,
            content_type='text/plain',
        )
