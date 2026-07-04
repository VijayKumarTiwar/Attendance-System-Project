from rest_framework import viewsets
from .models import Journey, ChecklistTask
from .serializers import JourneySerializer, ChecklistTaskSerializer

class JourneyViewSet(viewsets.ModelViewSet):
    queryset = Journey.objects.all()
    serializer_class = JourneySerializer

class ChecklistTaskViewSet(viewsets.ModelViewSet):
    queryset = ChecklistTask.objects.all()
    serializer_class = ChecklistTaskSerializer

