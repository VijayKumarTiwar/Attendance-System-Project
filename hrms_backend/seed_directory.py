import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_backend.settings')
django.setup()

from employees.models import Employee, Branch
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_directory():
    branch = Branch.objects.first()

    employees_data = [
        {'username': 'john.doe', 'code': 'EMP002', 'name': 'John Doe', 'email': 'john.doe@vijaysoftware.com', 'designation': 'Senior Developer', 'department': 'engineering'},
        {'username': 'jane.smith', 'code': 'EMP003', 'name': 'Jane Smith', 'email': 'jane.smith@vijaysoftware.com', 'designation': 'HR Manager', 'department': 'hr'},
        {'username': 'mike.johnson', 'code': 'EMP004', 'name': 'Mike Johnson', 'email': 'mike.johnson@vijaysoftware.com', 'designation': 'Sales Executive', 'department': 'sales'},
    ]

    for data in employees_data:
        user, created = User.objects.get_or_create(username=data['username'])
        if created:
            user.set_password('password123')
            user.save()

        Employee.objects.update_or_create(
            employee_code=data['code'],
            defaults={
                'user': user,
                'name': data['name'],
                'email': data['email'],
                'designation': data['designation'],
                'department': data['department'],
                'branch': branch
            }
        )

    print("Successfully seeded Directory data.")

if __name__ == '__main__':
    seed_directory()
