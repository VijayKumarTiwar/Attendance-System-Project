import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_backend.settings')
django.setup()

from employees.models import Employee
from helpdesk.models import Ticket

def seed_helpdesk():
    employee = Employee.objects.first()
    if not employee:
        print("No employee found to seed helpdesk tickets.")
        return

    # Seed Helpdesk Tickets
    Ticket.objects.get_or_create(
        employee=employee,
        subject='Laptop screen flickering',
        defaults={
            'description': 'My primary laptop screen flickers randomly during the day.',
            'category': 'it',
            'priority': 'high',
            'status': 'open'
        }
    )

    Ticket.objects.get_or_create(
        employee=employee,
        subject='Incorrect tax deduction on last payslip',
        defaults={
            'description': 'The tax deduction for May seems to be calculated incorrectly compared to previous months.',
            'category': 'payroll',
            'priority': 'medium',
            'status': 'in_progress'
        }
    )

    Ticket.objects.get_or_create(
        employee=employee,
        subject='Request for updated ID card',
        defaults={
            'description': 'My ID card is worn out and the chip occasionally fails at the door.',
            'category': 'general',
            'priority': 'low',
            'status': 'resolved'
        }
    )

    print("Successfully seeded Helpdesk data.")

if __name__ == '__main__':
    seed_helpdesk()
