import os
import django
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_backend.settings')
django.setup()

from employees.models import Employee
from hr_report.models import HRReport
from django.contrib.auth import get_user_model

def seed_reports():
    employee = Employee.objects.first()
    if not employee:
        print("No employee found to seed reports.")
        return

    HRReport.objects.create(
        employee=employee.user,
        report_type='Attendance Summary',
        period_start=datetime.date(2026, 5, 1),
        period_end=datetime.date(2026, 5, 31),
        data={"total_days": 31, "present": 22, "absent": 1, "leaves": 2, "weekends": 6}
    )

    HRReport.objects.create(
        employee=employee.user,
        report_type='Compensation Breakdown',
        period_start=datetime.date(2026, 5, 1),
        period_end=datetime.date(2026, 5, 31),
        data={"basic": 50000, "hra": 20000, "deductions": 3000, "net": 67000}
    )

    HRReport.objects.create(
        employee=employee.user,
        report_type='Annual Performance Review',
        period_start=datetime.date(2025, 4, 1),
        period_end=datetime.date(2026, 3, 31),
        data={"rating": "Exceeds Expectations", "feedback": "Excellent work this year.", "bonus": "Eligible"}
    )

    print("Successfully seeded HR Reports.")

if __name__ == '__main__':
    seed_reports()
