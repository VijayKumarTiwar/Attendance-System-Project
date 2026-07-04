import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_backend.settings')
django.setup()

from employees.models import Branch, Employee

# 1. Create Kota Branch
kota_branch, created = Branch.objects.get_or_create(
    name='Kota Office',
    defaults={
        'address': 'Kota, Rajasthan',
        'latitude': 25.2138,
        'longitude': 75.8648,
        'geofence_radius_meters': 500, # Generous radius
    }
)
print(f"Branch: {kota_branch.name} created/found.")

# 2. Assign EMP001 (Vijay) to Kota Office
emp = Employee.objects.get(employee_code='EMP001')
emp.branch = kota_branch
emp.save()

print(f"Assigned {emp.name} to {kota_branch.name}.")
