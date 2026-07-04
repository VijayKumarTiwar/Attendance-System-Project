from rest_framework import viewsets
from .models import HRReport
from .serializers import HRReportSerializer

class HRReportViewSet(viewsets.ModelViewSet):
    queryset = HRReport.objects.all()
    serializer_class = HRReportSerializer

