from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import date
from .models import AttendanceLog
from .serializers import AttendanceLogSerializer
from employees.models import Employee
from shifts.models import ShiftAssignment


@api_view(['POST'])
def punch_in(request):
    """
    Punch In with GPS coordinates and optional face image.
    Expected data: employee_code, latitude, longitude, face_image (optional file)
    """
    employee_code = request.data.get('employee_code', '').strip()
    latitude = request.data.get('latitude')
    longitude = request.data.get('longitude')
    face_image = request.FILES.get('face_image')

    if not employee_code:
        return Response({'error': 'Employee code is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        employee = Employee.objects.select_related('branch').get(employee_code=employee_code, is_active=True)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

    today = date.today()

    # Check if already punched in today
    existing = AttendanceLog.objects.filter(employee=employee, work_date=today).first()
    if existing and existing.check_in_at:
        return Response({'error': 'Already punched in today.', 'log': AttendanceLogSerializer(existing).data},
                        status=status.HTTP_400_BAD_REQUEST)

    # GPS geofence validation
    distance = None
    within_geofence = True
    if employee.branch and latitude and longitude:
        try:
            lat = float(latitude)
            lon = float(longitude)
            distance = round(employee.branch.distance_to(lat, lon), 1)
            within_geofence = employee.branch.is_within_geofence(lat, lon)
        except (ValueError, TypeError):
            pass

    if not within_geofence:
        return Response({
            'error': f'You are outside the geofence area. Distance: {distance}m, Allowed: {employee.branch.geofence_radius_meters}m',
            'distance': distance,
            'allowed_radius': employee.branch.geofence_radius_meters
        }, status=status.HTTP_403_FORBIDDEN)

    # Determine status (PRESENT or LATE) based on shift
    now = timezone.now()
    punch_status = 'PRESENT'
    try:
        assignment = ShiftAssignment.objects.filter(
            employee=employee,
            effective_from__lte=today,
            shift__is_active=True
        ).order_by('-effective_from').first()

        if assignment:
            shift_start = timezone.make_aware(
                timezone.datetime.combine(today, assignment.shift.start_time)
            )
            grace_end = shift_start + timezone.timedelta(minutes=assignment.shift.grace_period_minutes)
            if now > grace_end:
                punch_status = 'LATE'
    except Exception:
        pass

    # Create or update log
    log, created = AttendanceLog.objects.get_or_create(
        employee=employee,
        work_date=today,
        defaults={
            'check_in_at': now,
            'check_in_latitude': float(latitude) if latitude else None,
            'check_in_longitude': float(longitude) if longitude else None,
            'check_in_distance': distance,
            'face_image_in': face_image,
            'status': punch_status,
        }
    )

    if not created:
        log.check_in_at = now
        log.check_in_latitude = float(latitude) if latitude else None
        log.check_in_longitude = float(longitude) if longitude else None
        log.check_in_distance = distance
        if face_image:
            log.face_image_in = face_image
        log.status = punch_status
        log.save()

    serializer = AttendanceLogSerializer(log)
    return Response({
        'message': f'Punch In successful! Status: {punch_status}',
        'log': serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def punch_out(request):
    """
    Punch Out with GPS coordinates and optional face image.
    Expected data: employee_code, latitude, longitude, face_image (optional file)
    """
    employee_code = request.data.get('employee_code', '').strip()
    latitude = request.data.get('latitude')
    longitude = request.data.get('longitude')
    face_image = request.FILES.get('face_image')

    if not employee_code:
        return Response({'error': 'Employee code is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        employee = Employee.objects.select_related('branch').get(employee_code=employee_code, is_active=True)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

    today = date.today()
    try:
        log = AttendanceLog.objects.get(employee=employee, work_date=today)
    except AttendanceLog.DoesNotExist:
        return Response({'error': 'No punch-in found for today. Please punch in first.'},
                        status=status.HTTP_400_BAD_REQUEST)

    if log.check_out_at:
        return Response({'error': 'Already punched out today.', 'log': AttendanceLogSerializer(log).data},
                        status=status.HTTP_400_BAD_REQUEST)

    # GPS geofence validation
    distance = None
    within_geofence = True
    if employee.branch and latitude and longitude:
        try:
            lat = float(latitude)
            lon = float(longitude)
            distance = round(employee.branch.distance_to(lat, lon), 1)
            within_geofence = employee.branch.is_within_geofence(lat, lon)
        except (ValueError, TypeError):
            pass

    if not within_geofence:
        return Response({
            'error': f'You are outside the geofence area. Distance: {distance}m, Allowed: {employee.branch.geofence_radius_meters}m',
            'distance': distance,
            'allowed_radius': employee.branch.geofence_radius_meters
        }, status=status.HTTP_403_FORBIDDEN)

    now = timezone.now()
    log.check_out_at = now
    log.check_out_latitude = float(latitude) if latitude else None
    log.check_out_longitude = float(longitude) if longitude else None
    log.check_out_distance = distance
    if face_image:
        log.face_image_out = face_image
    log.save()

    serializer = AttendanceLogSerializer(log)
    return Response({
        'message': f'Punch Out successful! Total Hours: {log.total_hours or 0}h',
        'log': serializer.data
    })


@api_view(['GET'])
def today_log(request):
    """Get today's attendance log for an employee."""
    employee_code = request.GET.get('employee_code', '').strip()
    if not employee_code:
        return Response({'error': 'employee_code query param required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        employee = Employee.objects.get(employee_code=employee_code, is_active=True)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

    today = date.today()
    try:
        log = AttendanceLog.objects.get(employee=employee, work_date=today)
        serializer = AttendanceLogSerializer(log)
        return Response(serializer.data)
    except AttendanceLog.DoesNotExist:
        return Response({'message': 'No attendance record for today.', 'log': None})


@api_view(['GET'])
def attendance_history(request):
    """Get attendance history for an employee."""
    employee_code = request.GET.get('employee_code', '').strip()
    if not employee_code:
        return Response({'error': 'employee_code query param required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        employee = Employee.objects.get(employee_code=employee_code, is_active=True)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

    logs = AttendanceLog.objects.filter(employee=employee).order_by('-work_date')[:30]
    serializer = AttendanceLogSerializer(logs, many=True)
    return Response(serializer.data)
