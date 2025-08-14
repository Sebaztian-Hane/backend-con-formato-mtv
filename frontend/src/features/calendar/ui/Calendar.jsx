import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarOverrides.css';
import styles from './Calendar.module.css';
import { Modal, Spin, Flex } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useCalendar } from '../hook/calendarHook';

moment.locale('es', {
  months:
    'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_',
    ),
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
});

const localizer = momentLocalizer(moment);

const Calendario = () => {
  const { events, loading, error } = useCalendar();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [date, setDate] = React.useState(new Date());
  const [view, setView] = React.useState('month');

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const getEventColor = (statusId) => {
    switch (statusId) {
      case 1:
        return '#FFA500';
      case 2:
        return '#4CAF50';
      default:
        return '#888';
    }
  };

  const eventPropGetter = (event) => {
    const status = event.details.appointment_status_id;
    if (status === 1) {
      return { className: 'pending-event' };
    } else if (status === 2) {
      return { className: 'confirmed-event' };
    }
    return {};
  };

  const EventContent = ({ event }) => {
    const status = event.details.appointment_status_id;
    let prefix = '';
    if (status === 1) prefix = '[PENDIENTE]';
    if (status === 2) prefix = '[CONFIRMADA]';
    return (
      <span
        style={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '0.95em',
        }}
      >
        {prefix}
        {event.details.patient_first_name
          ? ` - ${event.details.patient_first_name}`
          : ''}
      </span>
    );
  };

  const getAppointmentStatus = (statusId) => {
    switch (statusId) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Confirmada';
      case 3:
        return 'Completada';
      case 4:
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const getPaymentType = (typeId) => {
    switch (typeId) {
      case 1:
        return 'Efectivo';
      case 2:
        return 'Tarjeta';
      case 3:
        return 'Transferencia';
      default:
        return 'Desconocido';
    }
  };

  if (error) {
    return <p>Error al cargar eventos: {error.message}</p>;
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.mainContent}>
        <div className={styles.calendarWrapper}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventPropGetter}
            components={{ event: EventContent }}
            date={date}
            onNavigate={handleNavigate}
            view={view}
            onView={handleViewChange}
            messages={{
              today: 'Hoy',
              previous: 'Anterior',
              next: 'Siguiente',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'No hay citas en este rango de fechas.',
            }}
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
          />
        </div>
      </div>

      <Modal
        title="Detalles de la Cita"
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        maskClosable={true}
        width={600}
      >
        {selectedEvent && (
          <div style={{ color: 'black' }}>
            <p>
              <strong>Paciente:</strong>{' '}
              {selectedEvent.details.patient_full_name}
            </p>
            <p>
              <strong>Terapeuta:</strong>{' '}
              {selectedEvent.details.therapist_full_name}
            </p>
            <p>
              <strong>Tipo de cita:</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Fecha:</strong>{' '}
              {dayjs(selectedEvent.start).format('DD/MM/YYYY')}
            </p>
            <p>
              <strong>Hora:</strong>{' '}
              {dayjs(selectedEvent.start).format('HH:mm')} -{' '}
              {dayjs(selectedEvent.end).format('HH:mm')}
            </p>
            <p>
              <strong>Diagnóstico:</strong>{' '}
              {selectedEvent.details.diagnosis || 'No especificado'}
            </p>
            <p>
              <strong>Malestar:</strong>{' '}
              {selectedEvent.details.ailments || 'No especificado'}
            </p>
            <p>
              <strong>Observaciones:</strong>{' '}
              {selectedEvent.details.observation || 'Ninguna'}
            </p>
            <p>
              <strong>Tipo de pago:</strong>{' '}
              {selectedEvent.details.payment_type_name}
            </p>
            <p>
              <strong>Ticket:</strong> {selectedEvent.details.ticket_number}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Calendario;
