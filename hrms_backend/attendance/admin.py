from django.contrib import admin
from .models import AttendanceLog


@admin.register(AttendanceLog)
class AttendanceLogAdmin(admin.ModelAdmin):
    list_display = ['employee', 'work_date', 'check_in_at', 'check_out_at', 'status', 'total_hours', 'check_in_distance']
    list_filter = ['status', 'work_date', 'employee__branch']
    search_fields = ['employee__employee_code', 'employee__name']
    date_hierarchy = 'work_date'
    readonly_fields = ['total_hours', 'created_at', 'updated_at']
    list_per_page = 50

    fieldsets = (
        ('Employee & Date', {
            'fields': ('employee', 'work_date', 'status', 'remarks')
        }),
        ('Check-In Details', {
            'fields': ('check_in_at', 'check_in_latitude', 'check_in_longitude', 'check_in_distance', 'face_image_in')
        }),
        ('Check-Out Details', {
            'fields': ('check_out_at', 'check_out_latitude', 'check_out_longitude', 'check_out_distance', 'face_image_out')
        }),
        ('Computed', {
            'fields': ('total_hours', 'created_at', 'updated_at')
        }),
    )
