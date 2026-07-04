from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'journeys', views.JourneyViewSet)
router.register(r'checklist_tasks', views.ChecklistTaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
