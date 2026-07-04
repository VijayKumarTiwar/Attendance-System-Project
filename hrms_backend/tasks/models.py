from django.db import models
from employees.models import Employee

class Journey(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed')
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='journeys')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.employee.name}"

class ChecklistTask(models.Model):
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    is_completed = models.BooleanField(default=False)
    due_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title
