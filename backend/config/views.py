from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.cache import cache_control


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
