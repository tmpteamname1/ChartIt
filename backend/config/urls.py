"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

import config.schema  # noqa: F401  (registers the session login with drf-spectacular)
from config.views import api_not_found, health, media, spa_index

# API routes (docs chapter 4.9): /api/<resource>/, English plural nouns in kebab-case.
# Each Django app lists its views in its own urls.py (DRF router), included here.
api_urlpatterns = [
    path('health/', health, name='health'),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Must stay last.
    re_path(r'^(?P<path>.*)$', api_not_found),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_urlpatterns)),
    # Uploaded files (MEDIA_URL), served by Django in every environment (docs chapter 6).
    re_path(r'^media/(?P<path>.+)$', media, name='media'),
    # Every path not owned by Django returns the React app (must stay last).
    re_path(r'^(?!(?:api|admin|static|media)(?:/|$)).*$', spa_index, name='spa'),
]
