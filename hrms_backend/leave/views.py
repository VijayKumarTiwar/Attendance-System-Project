from rest_framework import viewsets
from .models import AbsenceBalance, LeaveRequest
from .serializers import AbsenceBalanceSerializer, LeaveRequestSerializer

class AbsenceBalanceViewSet(viewsets.ModelViewSet):
    queryset = AbsenceBalance.objects.all()
    serializer_class = AbsenceBalanceSerializer

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer

