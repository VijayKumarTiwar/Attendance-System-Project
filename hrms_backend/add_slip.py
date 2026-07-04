import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_backend.settings')
django.setup()

from employees.models import Employee
from payroll.models import SalarySlip

emp = Employee.objects.filter(name__icontains="Vijay Kumar Tiwari").first()
if not emp:
    emp = Employee.objects.first()

if emp:
    print(f"Adding slip for employee: {emp.name}")
    
    slip, created = SalarySlip.objects.get_or_create(
        employee=emp,
        month=3,
        year=2026,
        defaults={
            'basic_salary': 15010.00,
            'allowances': 11495.00,
            'deductions': 2000.00,
            'net_payable': 24505.00
        }
    )
    if not created:
        slip.basic_salary = 15010.00
        slip.allowances = 11495.00
        slip.deductions = 2000.00
        slip.net_payable = 24505.00
        slip.save()
        print("Slip updated.")
    else:
        print("Slip created.")
else:
    print("Employee not found.")
