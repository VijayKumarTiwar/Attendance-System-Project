from django.db import models
from employees.models import Employee

class JobOpening(models.Model):
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=100)
    posted_on = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Referral(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('selected', 'Selected'),
        ('rejected', 'Rejected')
    ]
    referred_by = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='referrals')
    candidate_name = models.CharField(max_length=200)
    candidate_email = models.EmailField()
    job_opening = models.ForeignKey(JobOpening, on_delete=models.CASCADE, related_name='referrals')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate_name} referred by {self.referred_by.name}"
