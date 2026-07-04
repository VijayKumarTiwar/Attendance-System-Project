"""
Seed script to populate initial data for Vijay Software PVT LTD HRMS.
Run: python manage.py shell < seed_data.py
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_backend.settings')
django.setup()

from django.contrib.auth.models import User
from employees.models import Branch, Employee
from shifts.models import Shift, ShiftAssignment
from datetime import date, time

print("=" * 50)
print("Seeding HRMS Database...")
print("=" * 50)

# 1. Create Superuser (admin)
if not User.objects.filter(username='admin').exists():
    admin_user = User.objects.create_superuser('admin', 'admin@vjaysoftware.com', 'admin123')
    print("[OK] Created superuser: admin / admin123")
else:
    admin_user = User.objects.get(username='admin')
    print("-> Superuser 'admin' already exists")

# 2. Create Branches
branch_hq, _ = Branch.objects.get_or_create(
    name='Corporate Headquarters',
    defaults={
        'address': 'Vijay Software PVT LTD, Sector 62, Noida, UP',
        'latitude': 28.6273,
        'longitude': 77.3754,
        'geofence_radius_meters': 150,
    }
)
print(f"[OK] Branch: {branch_hq}")

branch_mumbai, _ = Branch.objects.get_or_create(
    name='Mumbai Office',
    defaults={
        'address': 'Andheri East, Mumbai, MH',
        'latitude': 19.1136,
        'longitude': 72.8697,
        'geofence_radius_meters': 200,
    }
)
print(f"[OK] Branch: {branch_mumbai}")

branch_bangalore, _ = Branch.objects.get_or_create(
    name='Bangalore Tech Park',
    defaults={
        'address': 'Electronic City, Bangalore, KA',
        'latitude': 12.8399,
        'longitude': 77.6770,
        'geofence_radius_meters': 180,
    }
)
print(f"[OK] Branch: {branch_bangalore}")

# 3. Create Employees
employees_data = [
    {'code': 'EMP001', 'name': 'Vijay Kumar Tiwari', 'designation': 'CEO & Founder', 'dept': 'admin', 'branch': branch_hq, 'username': 'vijay', 'password': 'vijay123'},
    {'code': 'EMP002', 'name': 'Ananya Sharma', 'designation': 'HR Manager', 'dept': 'hr', 'branch': branch_hq, 'username': 'ananya', 'password': 'emp123'},
    {'code': 'EMP003', 'name': 'Rahul Verma', 'designation': 'Senior Developer', 'dept': 'engineering', 'branch': branch_bangalore, 'username': 'rahul', 'password': 'emp123'},
    {'code': 'EMP004', 'name': 'Priya Patel', 'designation': 'Finance Lead', 'dept': 'finance', 'branch': branch_mumbai, 'username': 'priya', 'password': 'emp123'},
    {'code': 'EMP005', 'name': 'Amit Singh', 'designation': 'DevOps Engineer', 'dept': 'it', 'branch': branch_hq, 'username': 'amit', 'password': 'emp123'},
]

for emp_data in employees_data:
    user, created = User.objects.get_or_create(
        username=emp_data['username'],
        defaults={'first_name': emp_data['name'].split()[0], 'last_name': ' '.join(emp_data['name'].split()[1:])}
    )
    if created:
        user.set_password(emp_data['password'])
        user.save()

    emp, created = Employee.objects.get_or_create(
        employee_code=emp_data['code'],
        defaults={
            'user': user,
            'name': emp_data['name'],
            'designation': emp_data['designation'],
            'department': emp_data['dept'],
            'branch': emp_data['branch'],
            'email': f"{emp_data['username']}@vjaysoftware.com",
            'date_of_joining': date(2024, 1, 15),
        }
    )
    print(f"[OK] Employee: {emp}")

# 4. Create Shifts
morning_shift, _ = Shift.objects.get_or_create(
    name='Morning Shift',
    defaults={'start_time': time(9, 0), 'end_time': time(18, 0), 'grace_period_minutes': 15}
)
print(f"[OK] Shift: {morning_shift}")

night_shift, _ = Shift.objects.get_or_create(
    name='Night Shift',
    defaults={'start_time': time(21, 0), 'end_time': time(6, 0), 'grace_period_minutes': 10}
)
print(f"[OK] Shift: {night_shift}")

flexible_shift, _ = Shift.objects.get_or_create(
    name='Flexible Shift',
    defaults={'start_time': time(10, 0), 'end_time': time(19, 0), 'grace_period_minutes': 30}
)
print(f"[OK] Shift: {flexible_shift}")

# 5. Assign shifts to employees
for emp in Employee.objects.all():
    ShiftAssignment.objects.get_or_create(
        employee=emp,
        shift=morning_shift,
        defaults={'effective_from': date(2024, 1, 15)}
    )

print(f"\n[OK] Assigned Morning Shift to all employees")

print("\n" + "=" * 50)
print("[OK] Database seeded successfully!")
print("=" * 50)
print("\nAdmin Login: http://127.0.0.1:8000/admin/")
print("Username: admin")
print("Password: admin123")
print("\nEmployee Login (API):")
print("  EMP001 / vijay123 (Vijay Kumar Tiwari)")
print("  EMP002 / emp123 (Ananya Sharma)")
print("  EMP003 / emp123 (Rahul Verma)")
print("  EMP004 / emp123 (Priya Patel)")
print("  EMP005 / emp123 (Amit Singh)")
