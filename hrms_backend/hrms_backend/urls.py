"""
URL configuration for hrms_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

# Customize admin header
admin.site.site_header = "Rajasthan State Gas Limited - HRMS Admin"
admin.site.site_title = "HRMS Admin Portal"
admin.site.index_title = "Welcome to Rajasthan State Gas Limited HRMS"

urlpatterns = [
    path('', RedirectView.as_view(url='admin/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/auth/', include('employees.urls')),
    path('api/employees/', include('employees.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/shifts/', include('shifts.urls')),
    path('api/hr_core/', include('hr_core.urls')),
    path('api/hr_report/', include('hr_report.urls')),
    path('api/payroll/', include('payroll.urls')),
    path('api/leave/', include('leave.urls')),
    path('api/performance/', include('performance.urls')),
    path('api/recruitment/', include('recruitment.urls')),
    path('api/helpdesk/', include('helpdesk.urls')),
    path('api/tasks/', include('tasks.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
