from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'document_records', views.DocumentRecordViewSet)
router.register(r'emergency_contacts', views.EmergencyContactViewSet)
router.register(r'bank_details', views.BankDetailViewSet)
router.register(r'policys', views.PolicyViewSet)
router.register(r'holidays', views.HolidayViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
