from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'absence_balances', views.AbsenceBalanceViewSet)
router.register(r'leave_requests', views.LeaveRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
