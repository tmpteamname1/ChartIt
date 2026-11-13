from rest_framework.routers import SimpleRouter

from .views import CategoryViewSet, PortViewSet

router = SimpleRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('ports', PortViewSet, basename='port')

urlpatterns = router.urls
