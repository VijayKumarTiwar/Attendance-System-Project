from django.db import models
from employees.models import Employee

class PerformanceReview(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='performance_reviews')
    review_period_start = models.DateField()
    review_period_end = models.DateField()
    rating = models.PositiveSmallIntegerField(help_text='1-5 rating')
    comments = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('employee', 'review_period_start', 'review_period_end')
        ordering = ['-review_period_end']

    def __str__(self):
        return f"{self.employee.name} Review {self.review_period_start} - {self.review_period_end}"

class Reward(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='rewards')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    awarded_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} for {self.employee.name}"
