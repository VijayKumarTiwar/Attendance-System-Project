from rest_framework import serializers
from .models import CompensationDetail, SalarySlip

class CompensationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompensationDetail
        fields = '__all__'

class SalarySlipSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalarySlip
        fields = '__all__'

