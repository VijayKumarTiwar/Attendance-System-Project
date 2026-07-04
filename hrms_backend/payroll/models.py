from django.db import models
from employees.models import Employee

class CompensationDetail(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='compensation')
    current_ctc = models.DecimalField(max_digits=12, decimal_places=2)
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    effective_date = models.DateField()

    def __str__(self):
        return f"{self.employee.name} - {self.current_ctc}"

class SalarySlip(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='salary_slips')
    month = models.PositiveIntegerField() # 1-12
    year = models.PositiveIntegerField()
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2)
    deductions = models.DecimalField(max_digits=10, decimal_places=2)
    net_payable = models.DecimalField(max_digits=10, decimal_places=2)
    file = models.FileField(upload_to='payslips/', blank=True, null=True)

    class Meta:
        unique_together = ('employee', 'month', 'year')

    def __str__(self):
        return f"{self.employee.name} - {self.month}/{self.year}"
