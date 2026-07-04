from django.contrib import admin
from .models import DocumentRecord, EmergencyContact, BankDetail, Policy, Holiday

admin.site.register(DocumentRecord)
admin.site.register(EmergencyContact)
admin.site.register(BankDetail)
admin.site.register(Policy)
admin.site.register(Holiday)
