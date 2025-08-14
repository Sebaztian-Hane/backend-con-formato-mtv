from datetime import datetime
from appointments.models import Appointment

class TicketService:
    @staticmethod
    def generate_next_room_number(date_str, exclude_appointment_id=None):
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
        is_weekend = date_obj.weekday() >= 5
        max_rooms = 24 if is_weekend else 14

        # Obtener todas las salas ocupadas para esta fecha
        query = Appointment.objects.filter(appointment_date=date_obj, room__isnull=False, deleted_at__isnull=True)
        if exclude_appointment_id:
            query = query.exclude(id=exclude_appointment_id)
        used_room_numbers = list(query.values_list('room', flat=True))

        for i in range(1, max_rooms + 1):
            if i not in used_room_numbers:
                return i
        room_count = len(used_room_numbers)
        return (room_count % max_rooms) + 1

    @staticmethod
    def generate_next_ticket_number(date_str, exclude_appointment_id=None):
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
        query = Appointment.objects.filter(appointment_date=date_obj, ticket__isnull=False, deleted_at__isnull=True)
        if exclude_appointment_id:
            query = query.exclude(id=exclude_appointment_id)
        used_ticket_numbers = list(query.values_list('ticket', flat=True))
        max_tickets = 1000  # Ajusta según tu lógica
        for i in range(1, max_tickets + 1):
            if i not in used_ticket_numbers:
                return i
        ticket_count = len(used_ticket_numbers)
        return (ticket_count % max_tickets) + 1