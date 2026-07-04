from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import date
from employees.models import Employee
from .models import Shift, ShiftAssignment
from .serializers import ShiftSerializer, ShiftAssignmentSerializer


@api_view(['GET'])
def my_shift(request):
    """Get the current shift assignment for an employee."""
    employee_code = request.GET.get('employee_code', '').strip()
    if not employee_code:
        return Response({'error': 'employee_code query param required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        employee = Employee.objects.get(employee_code=employee_code, is_active=True)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

    today = date.today()
    assignment = ShiftAssignment.objects.filter(
        employee=employee,
        effective_from__lte=today,
        shift__is_active=True
    ).filter(
        effective_to__gte=today
    ).select_related('shift').order_by('-effective_from').first()

    # Fallback: if no end date filter matches, try without it
    if not assignment:
        assignment = ShiftAssignment.objects.filter(
            employee=employee,
            effective_from__lte=today,
            effective_to__isnull=True,
            shift__is_active=True
        ).select_related('shift').order_by('-effective_from').first()

    if assignment:
        serializer = ShiftAssignmentSerializer(assignment)
        return Response(serializer.data)
    else:
        return Response({'message': 'No shift assigned.', 'shift': None})


@api_view(['GET'])
def shift_list(request):
    """List all active shifts."""
    shifts = Shift.objects.filter(is_active=True)
    serializer = ShiftSerializer(shifts, many=True)
    return Response(serializer.data)
