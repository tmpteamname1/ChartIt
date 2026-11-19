from rest_framework.routers import SimpleRouter

from .views import CategoryViewSet, CompanyVesselViewSet, PortViewSet, VesselViewSet

router = SimpleRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('ports', PortViewSet, basename='port')
router.register('vessels', VesselViewSet, basename='vessel')
router.register('company/vessels', CompanyVesselViewSet, basename='company-vessel')

urlpatterns = router.urls
