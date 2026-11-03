import logging

from django.conf import settings
from django.db import DatabaseError, connection
from django.http import HttpResponse, JsonResponse
from django.views.decorators.cache import cache_control, never_cache
from django.views.decorators.http import require_GET

logger = logging.getLogger(__name__)


@require_GET
@never_cache
def health(request):
    """Public health check: confirms the API is running and the database answers."""
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
            cursor.fetchone()
    except DatabaseError:
        logger.exception('Health check: database unavailable')
        return JsonResponse({'status': 'error', 'database': 'unavailable'}, status=503)
    return JsonResponse({'status': 'ok', 'database': 'ok'})


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
