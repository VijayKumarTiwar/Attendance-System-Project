from rest_framework import viewsets
from .models import DocumentRecord, EmergencyContact, BankDetail, Policy, Holiday
from .serializers import DocumentRecordSerializer, EmergencyContactSerializer, BankDetailSerializer, PolicySerializer, HolidaySerializer

class DocumentRecordViewSet(viewsets.ModelViewSet):
    queryset = DocumentRecord.objects.all()
    serializer_class = DocumentRecordSerializer

class EmergencyContactViewSet(viewsets.ModelViewSet):
    queryset = EmergencyContact.objects.all()
    serializer_class = EmergencyContactSerializer

class BankDetailViewSet(viewsets.ModelViewSet):
    queryset = BankDetail.objects.all()
    serializer_class = BankDetailSerializer

class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer

class HolidayViewSet(viewsets.ModelViewSet):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer

