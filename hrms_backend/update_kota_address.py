import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_backend.settings')
django.setup()

from employees.models import Branch

try:
    kota_branch = Branch.objects.get(name='Kota Office')
    kota_branch.address = "A-1, 2nd Floor, Skyline Shopping, C-1/A, Rajeev Gandhi Nagar, Opposite City Mall, Jhalawar Road, Kota, Rajasthan 324005"
    kota_branch.save()
    print("Address updated successfully.")
except Branch.DoesNotExist:
    print("Kota Office branch not found.")
