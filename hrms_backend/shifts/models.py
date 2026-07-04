from django.db import models
from employees.models import Employee


class Shift(models.Model):
    """Work shift definition with start/end times and grace period."""
    name = models.CharField(max_length=100, help_text="e.g. Morning Shift, Night Shift")
    start_time = models.TimeField(help_text="Shift start time")
    end_time = models.TimeField(help_text="Shift end time")
    grace_period_minutes = models.PositiveIntegerField(
        default=15,
        help_text="Grace period in minutes after shift start before marking LATE"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.name} ({self.start_time.strftime('%I:%M %p')} - {self.end_time.strftime('%I:%M %p')})"


class ShiftAssignment(models.Model):
    """Assigns a shift to an employee for a date range."""
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='shift_assignments')
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='assignments')
    effective_from = models.DateField(help_text="Shift assignment start date")
    effective_to = models.DateField(null=True, blank=True, help_text="Shift assignment end date (blank = ongoing)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-effective_from']

    def __str__(self):
        return f"{self.employee.employee_code} → {self.shift.name} (from {self.effective_from})"
