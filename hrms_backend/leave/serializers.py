from rest_framework import serializers
from .models import AbsenceBalance, LeaveRequest

class AbsenceBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbsenceBalance
        fields = '__all__'

class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = '__all__'

