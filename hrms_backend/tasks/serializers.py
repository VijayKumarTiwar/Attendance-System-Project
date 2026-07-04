from rest_framework import serializers
from .models import Journey, ChecklistTask

class JourneySerializer(serializers.ModelSerializer):
    class Meta:
        model = Journey
        fields = '__all__'

class ChecklistTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistTask
        fields = '__all__'

