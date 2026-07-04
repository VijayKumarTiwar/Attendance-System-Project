import os
import django
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_backend.settings')
django.setup()

from employees.models import Employee
from leave.models import AbsenceBalance, LeaveRequest

def seed_leave():
    employee = Employee.objects.first()
    if not employee:
        print("No employee found to seed leave.")
        return

    # Seed Absence Balances
    balances = [
        {'leave_type': 'SL', 'total': 10, 'used': 3},
        {'leave_type': 'PL', 'total': 18, 'used': 5},
        {'leave_type': 'CL', 'total': 7, 'used': 1},
    ]
    for b in balances:
        AbsenceBalance.objects.get_or_create(
            employee=employee,
            leave_type=b['leave_type'],
            defaults={
                'total_leaves': b['total'],
                'used_leaves': b['used']
            }
        )

    # Seed Leave Requests
    LeaveRequest.objects.get_or_create(
        employee=employee,
        leave_type='PL',
        start_date=datetime.date(2026, 6, 1),
        end_date=datetime.date(2026, 6, 5),
        defaults={
            'reason': 'Family Vacation',
            'status': 'Approved'
        }
    )

    LeaveRequest.objects.get_or_create(
        employee=employee,
        leave_type='SL',
        start_date=datetime.date(2026, 6, 15),
        end_date=datetime.date(2026, 6, 16),
        defaults={
            'reason': 'Fever and cold',
            'status': 'Pending'
        }
    )

    LeaveRequest.objects.get_or_create(
        employee=employee,
        leave_type='CL',
        start_date=datetime.date(2026, 5, 10),
        end_date=datetime.date(2026, 5, 10),
        defaults={
            'reason': 'Personal errands',
            'status': 'Approved'
        }
    )

    print("Successfully seeded Leave data.")

if __name__ == '__main__':
    seed_leave()
