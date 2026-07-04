from django.db import models
from django.contrib.auth import get_user_model

class HRReport(models.Model):
    """A generic HR report for an employee.

    The report can represent any aggregated data (e.g., attendance summary,
    compensation breakdown, performance metrics) and is stored as JSON.
    """
    employee = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='hr_reports')
    report_type = models.CharField(max_length=100, help_text='Type of report, e.g., attendance, compensation')
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)
    data = models.JSONField(default=dict, help_text='Arbitrary report data')
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-generated_at']
        verbose_name = 'HR Report'
        verbose_name_plural = 'HR Reports'

    def __str__(self):
        return f"{self.employee.username} - {self.report_type} ({self.period_start} to {self.period_end})"
