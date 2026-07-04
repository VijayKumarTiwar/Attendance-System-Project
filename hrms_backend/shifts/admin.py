from django.contrib import admin
from .models import Shift, ShiftAssignment


@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_time', 'end_time', 'grace_period_minutes', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']


@admin.register(ShiftAssignment)
class ShiftAssignmentAdmin(admin.ModelAdmin):
    list_display = ['employee', 'shift', 'effective_from', 'effective_to']
    list_filter = ['shift', 'effective_from']
    search_fields = ['employee__employee_code', 'employee__name']
    raw_id_fields = ['employee']
