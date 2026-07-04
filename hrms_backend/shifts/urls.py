from django.urls import path
from . import views

urlpatterns = [
    path('my-shift/', views.my_shift, name='my-shift'),
    path('list/', views.shift_list, name='shift-list'),
]
