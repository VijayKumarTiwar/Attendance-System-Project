from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='api-login'),
    path('me/', views.my_profile, name='my-profile'),
    path('list/', views.employee_list, name='employee-list'),
]
