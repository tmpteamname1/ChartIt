from rest_framework.routers import SimpleRouter

from .views import CategoryViewSet, PortViewSet, VesselViewSet

router = SimpleRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('ports', PortViewSet, basename='port')
router.register('vessels', VesselViewSet, basename='vessel')

urlpatterns = router.urls
