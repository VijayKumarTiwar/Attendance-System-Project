from rest_framework import serializers
from .models import AttendanceLog


class AttendanceLogSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    employee_code = serializers.CharField(source='employee.employee_code', read_only=True)

    class Meta:
        model = AttendanceLog
        fields = [
            'id', 'employee', 'employee_name', 'employee_code',
            'work_date', 'check_in_at', 'check_out_at',
            'check_in_latitude', 'check_in_longitude', 'check_in_distance',
            'check_out_latitude', 'check_out_longitude', 'check_out_distance',
            'face_image_in', 'face_image_out',
            'status', 'total_hours', 'remarks'
        ]
        read_only_fields = ['total_hours', 'check_in_distance', 'check_out_distance']
