import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import type { Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

interface Reserva {
  id: number;
  hospede: string;
  canal: string;
  checkIn: string;
  checkOut: string;
}

export default function CalendarView() {
  const [eventos, setEventos] = useState<Event[]>([]);

  useEffect(() => {
    axios.get<Reserva[]>('http://localhost:8081/reservas')
      .then(res => {
        const dados = res.data;

        const eventosFormatados: Event[] = dados.map(reserva => ({
          id: reserva.id,
          title: `${reserva.hospede} (${reserva.canal})`,
          start: new Date(reserva.checkIn),
          end: new Date(reserva.checkOut),
        }));

        setEventos(eventosFormatados);
      })
      .catch(error => console.error('Erro ao buscar reservas para o calendário:', error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Calendário de Reservas</h2>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}
