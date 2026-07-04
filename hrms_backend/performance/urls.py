from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'performance_reviews', views.PerformanceReviewViewSet)
router.register(r'rewards', views.RewardViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
