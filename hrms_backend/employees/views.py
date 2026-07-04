from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from .models import Employee
from .serializers import EmployeeSerializer


@api_view(['POST'])
def login_view(request):
    """
    Login with employee_code and password.
    Returns employee profile on success.
    """
    employee_code = request.data.get('employee_code', '').strip()
    password = request.data.get('password', '')

    if not employee_code or not password:
        return Response(
            {'error': 'Employee code and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        employee = Employee.objects.get(employee_code=employee_code, is_active=True)
    except Employee.DoesNotExist:
        return Response(
            {'error': 'Invalid employee code.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Authenticate using the linked Django User
    user = authenticate(request, username=employee.user.username, password=password)
    if user is None:
        return Response(
            {'error': 'Invalid password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)
    serializer = EmployeeSerializer(employee)
    return Response({
        'message': 'Login successful',
        'employee': serializer.data
    })


@api_view(['GET'])
def my_profile(request):
    """Get the employee's profile by employee_code."""
    employee_code = request.GET.get('employee_code', '').strip()
    if not employee_code:
        return Response({'error': 'employee_code query param required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        employee = Employee.objects.select_related('branch').get(employee_code=employee_code, is_active=True)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def employee_list(request):
    """List all active employees."""
    employees = Employee.objects.filter(is_active=True).select_related('branch')
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)
