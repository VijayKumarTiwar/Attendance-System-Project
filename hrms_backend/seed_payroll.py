import os
import django
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_backend.settings')
django.setup()

from employees.models import Employee
from payroll.models import CompensationDetail, SalarySlip

def seed_payroll():
    employee = Employee.objects.first()
    if not employee:
        print("No employee found to seed payroll.")
        return

    # Seed Compensation Detail
    if not hasattr(employee, 'compensation'):
        CompensationDetail.objects.create(
            employee=employee,
            current_ctc=1200000.00,
            basic_salary=50000.00,
            allowances=50000.00,
            effective_date=datetime.date(2025, 1, 1)
        )

    # Seed Salary Slips
    slips_data = [
        {'month': 5, 'year': 2026, 'basic_salary': 50000.00, 'allowances': 30000.00, 'deductions': 5000.00, 'net_payable': 75000.00},
        {'month': 4, 'year': 2026, 'basic_salary': 50000.00, 'allowances': 30000.00, 'deductions': 5000.00, 'net_payable': 75000.00},
        {'month': 3, 'year': 2026, 'basic_salary': 50000.00, 'allowances': 30000.00, 'deductions': 5000.00, 'net_payable': 75000.00},
    ]

    for sd in slips_data:
        SalarySlip.objects.get_or_create(
            employee=employee,
            month=sd['month'],
            year=sd['year'],
            defaults={
                'basic_salary': sd['basic_salary'],
                'allowances': sd['allowances'],
                'deductions': sd['deductions'],
                'net_payable': sd['net_payable']
            }
        )

    print("Successfully seeded Payroll data.")

if __name__ == '__main__':
    seed_payroll()
