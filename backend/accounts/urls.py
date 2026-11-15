from django.urls import path

from . import views

# Included under /api/auth/ only when ENABLE_TEST_LOGIN is on (config/urls.py).
test_login_urlpatterns = [
    path('test-login/', views.test_login, name='test-login'),
    path('test-logout/', views.test_logout, name='test-logout'),
]

# Always available, included under /api/auth/ (config/urls.py).
auth_urlpatterns = [
    path('me/', views.me, name='me'),
    path('logout/', views.logout_view, name='logout'),
]
