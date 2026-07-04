import os

apps = {
    'hr_core': ['DocumentRecord', 'EmergencyContact', 'BankDetail', 'Policy', 'Holiday'],
    'payroll': ['CompensationDetail', 'SalarySlip'],
    'leave': ['AbsenceBalance', 'LeaveRequest'],
    'performance': ['PerformanceReview', 'Reward'],
    'hr_report': ['HRReport'],
    'tasks': ['Journey', 'ChecklistTask'],
    'recruitment': ['JobOpening', 'Referral'],
    'helpdesk': ['Ticket']
}

base_dir = r"d:\Projects\Attendance\hrms_backend"

for app, models in apps.items():
    app_dir = os.path.join(base_dir, app)
    
    # 1. Write admin.py
    admin_code = f"from django.contrib import admin\nfrom .models import {', '.join(models)}\n\n"
    for m in models:
        admin_code += f"admin.site.register({m})\n"
    with open(os.path.join(app_dir, 'admin.py'), 'w') as f:
        f.write(admin_code)
        
    # 2. Write serializers.py
    ser_code = f"from rest_framework import serializers\nfrom .models import {', '.join(models)}\n\n"
    for m in models:
        ser_code += f"class {m}Serializer(serializers.ModelSerializer):\n    class Meta:\n        model = {m}\n        fields = '__all__'\n\n"
    with open(os.path.join(app_dir, 'serializers.py'), 'w') as f:
        f.write(ser_code)
        
    # 3. Write views.py
    views_code = f"from rest_framework import viewsets\nfrom .models import {', '.join(models)}\nfrom .serializers import {', '.join([m + 'Serializer' for m in models])}\n\n"
    for m in models:
        views_code += f"class {m}ViewSet(viewsets.ModelViewSet):\n    queryset = {m}.objects.all()\n    serializer_class = {m}Serializer\n\n"
    with open(os.path.join(app_dir, 'views.py'), 'w') as f:
        f.write(views_code)
        
    # 4. Write urls.py
    urls_code = f"from django.urls import path, include\nfrom rest_framework.routers import DefaultRouter\nfrom . import views\n\nrouter = DefaultRouter()\n"
    for m in models:
        # Create a basic slug for url
        slug = ''.join(['_'+c.lower() if c.isupper() else c for c in m]).lstrip('_')
        urls_code += f"router.register(r'{slug}s', views.{m}ViewSet)\n"
    urls_code += "\nurlpatterns = [\n    path('', include(router.urls)),\n]\n"
    with open(os.path.join(app_dir, 'urls.py'), 'w') as f:
        f.write(urls_code)

print("Scaffolding complete.")
