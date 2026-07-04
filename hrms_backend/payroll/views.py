from rest_framework import viewsets
from .models import CompensationDetail, SalarySlip
from .serializers import CompensationDetailSerializer, SalarySlipSerializer

class CompensationDetailViewSet(viewsets.ModelViewSet):
    queryset = CompensationDetail.objects.all()
    serializer_class = CompensationDetailSerializer

class SalarySlipViewSet(viewsets.ModelViewSet):
    queryset = SalarySlip.objects.all()
    serializer_class = SalarySlipSerializer

