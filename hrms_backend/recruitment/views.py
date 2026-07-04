from rest_framework import viewsets
from .models import JobOpening, Referral
from .serializers import JobOpeningSerializer, ReferralSerializer

class JobOpeningViewSet(viewsets.ModelViewSet):
    queryset = JobOpening.objects.all()
    serializer_class = JobOpeningSerializer

class ReferralViewSet(viewsets.ModelViewSet):
    queryset = Referral.objects.all()
    serializer_class = ReferralSerializer

