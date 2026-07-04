from rest_framework import serializers
from .models import Shift, ShiftAssignment


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ['id', 'name', 'start_time', 'end_time', 'grace_period_minutes', 'is_active']


class ShiftAssignmentSerializer(serializers.ModelSerializer):
    shift = ShiftSerializer(read_only=True)
    employee_code = serializers.CharField(source='employee.employee_code', read_only=True)

    class Meta:
        model = ShiftAssignment
        fields = ['id', 'employee', 'employee_code', 'shift', 'effective_from', 'effective_to']
