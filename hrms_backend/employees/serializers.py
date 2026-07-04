from rest_framework import serializers
from .models import Employee, Branch


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'address', 'latitude', 'longitude', 'geofence_radius_meters']


class EmployeeSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(read_only=True)

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_code', 'name', 'email', 'phone',
            'designation', 'department', 'branch', 'date_of_joining',
            'is_active', 'profile_photo'
        ]
