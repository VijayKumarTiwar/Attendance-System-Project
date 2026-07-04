from django.db import models
from employees.models import Employee

class DocumentRecord(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=100) # e.g., Aadhar, PAN, Degree
    file = models.FileField(upload_to='documents/')
    verified = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.name} - {self.document_type}"

class EmergencyContact(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='emergency_contacts')
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.employee.name} -> {self.name} ({self.relationship})"

class BankDetail(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='bank_details')
    bank_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=50)
    ifsc_code = models.CharField(max_length=20)
    branch_name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.employee.name} - {self.bank_name}"

class Policy(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='policies/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Holiday(models.Model):
    date = models.DateField()
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f"{self.name} ({self.date})"
