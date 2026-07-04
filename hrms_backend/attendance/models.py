from django.db import models
from employees.models import Employee


class AttendanceLog(models.Model):
    """Daily attendance record with GPS and face image data."""
    STATUS_CHOICES = [
        ('PRESENT', 'Present'),
        ('LATE', 'Late'),
        ('ABSENT', 'Absent'),
        ('HALF_DAY', 'Half Day'),
        ('ON_LEAVE', 'On Leave'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendance_logs')
    work_date = models.DateField(help_text="The date this attendance belongs to")

    # Check-in data
    check_in_at = models.DateTimeField(null=True, blank=True)
    check_in_latitude = models.FloatField(null=True, blank=True)
    check_in_longitude = models.FloatField(null=True, blank=True)
    check_in_distance = models.FloatField(null=True, blank=True, help_text="Distance from office in meters at check-in")
    face_image_in = models.ImageField(upload_to='face_punches/in/', null=True, blank=True)

    # Check-out data
    check_out_at = models.DateTimeField(null=True, blank=True)
    check_out_latitude = models.FloatField(null=True, blank=True)
    check_out_longitude = models.FloatField(null=True, blank=True)
    check_out_distance = models.FloatField(null=True, blank=True, help_text="Distance from office in meters at check-out")
    face_image_out = models.ImageField(upload_to='face_punches/out/', null=True, blank=True)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PRESENT')
    total_hours = models.FloatField(null=True, blank=True, help_text="Total working hours")
    remarks = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-work_date', '-check_in_at']
        unique_together = ['employee', 'work_date']
        verbose_name = "Attendance Log"
        verbose_name_plural = "Attendance Logs"

    def __str__(self):
        return f"{self.employee.employee_code} - {self.work_date} - {self.status}"

    def save(self, *args, **kwargs):
        """Auto-calculate total hours if both check_in and check_out exist."""
        if self.check_in_at and self.check_out_at:
            delta = self.check_out_at - self.check_in_at
            self.total_hours = round(delta.total_seconds() / 3600, 2)
        super().save(*args, **kwargs)
