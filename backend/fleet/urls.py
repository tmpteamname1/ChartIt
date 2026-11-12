from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, PortViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('ports', PortViewSet, basename='port')

urlpatterns = router.urls
