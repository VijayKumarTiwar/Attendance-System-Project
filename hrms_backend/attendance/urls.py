from django.urls import path
from . import views

urlpatterns = [
    path('punch-in/', views.punch_in, name='punch-in'),
    path('punch-out/', views.punch_out, name='punch-out'),
    path('today/', views.today_log, name='today-log'),
    path('history/', views.attendance_history, name='attendance-history'),
]
