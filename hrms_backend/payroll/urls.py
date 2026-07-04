from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'compensation_details', views.CompensationDetailViewSet)
router.register(r'salary_slips', views.SalarySlipViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
