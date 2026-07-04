from django.db import models
from django.contrib.auth.models import User
import math


class Branch(models.Model):
    """Office branch / location with geofence coordinates."""
    name = models.CharField(max_length=200)
    address = models.TextField(blank=True, default='')
    latitude = models.FloatField(help_text="Branch center latitude")
    longitude = models.FloatField(help_text="Branch center longitude")
    geofence_radius_meters = models.PositiveIntegerField(
        default=150,
        help_text="Allowed punch radius in meters"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Branches"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.geofence_radius_meters}m radius)"

    def is_within_geofence(self, lat, lon):
        """Check if given coordinates are within the geofence radius."""
        distance = self.distance_to(lat, lon)
        return distance <= self.geofence_radius_meters

    def distance_to(self, lat, lon):
        """Calculate distance in meters using Haversine formula."""
        R = 6371000  # Earth radius in meters
        phi1 = math.radians(self.latitude)
        phi2 = math.radians(lat)
        delta_phi = math.radians(lat - self.latitude)
        delta_lambda = math.radians(lon - self.longitude)

        a = (math.sin(delta_phi / 2) ** 2 +
             math.cos(phi1) * math.cos(phi2) *
             math.sin(delta_lambda / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c


class Employee(models.Model):
    """Employee profile linked to Django auth user."""
    DEPARTMENT_CHOICES = [
        ('engineering', 'Engineering'),
        ('hr', 'Human Resources'),
        ('finance', 'Finance'),
        ('operations', 'Operations'),
        ('marketing', 'Marketing'),
        ('sales', 'Sales'),
        ('admin', 'Administration'),
        ('it', 'IT'),
        ('other', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    employee_code = models.CharField(max_length=20, unique=True, help_text="e.g. EMP001")
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    designation = models.CharField(max_length=200, default='Employee')
    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES, default='other')
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    date_of_joining = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    profile_photo = models.ImageField(upload_to='profiles/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['employee_code']

    def __str__(self):
        return f"{self.employee_code} - {self.name}"
