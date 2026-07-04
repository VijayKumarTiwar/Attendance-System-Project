from django.db import models
from employees.models import Employee

class AbsenceBalance(models.Model):
    LEAVE_TYPES = [
        ('SL', 'Sick Leave'),
        ('PL', 'Privilege Leave'),
        ('CL', 'Casual Leave'),
        ('ML', 'Maternity/Paternity Leave')
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='absence_balances')
    leave_type = models.CharField(max_length=2, choices=LEAVE_TYPES)
    total_leaves = models.PositiveIntegerField(default=0)
    used_leaves = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('employee', 'leave_type')

    def __str__(self):
        return f"{self.employee.name} - {self.get_leave_type_display()}: {self.used_leaves}/{self.total_leaves}"

class LeaveRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=2, choices=AbsenceBalance.LEAVE_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    applied_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.name} - {self.get_leave_type_display()} ({self.start_date} to {self.end_date})"
