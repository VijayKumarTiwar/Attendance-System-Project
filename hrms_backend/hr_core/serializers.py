from rest_framework import serializers
from .models import DocumentRecord, EmergencyContact, BankDetail, Policy, Holiday

class DocumentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentRecord
        fields = '__all__'

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'

class BankDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankDetail
        fields = '__all__'

class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = '__all__'

class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = '__all__'

