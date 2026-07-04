from django.contrib import admin
from .models import Branch, Employee


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'latitude', 'longitude', 'geofence_radius_meters', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'address']


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['employee_code', 'name', 'designation', 'department', 'branch', 'is_active']
    list_filter = ['department', 'is_active', 'branch']
    search_fields = ['employee_code', 'name', 'email']
    list_editable = ['is_active']
