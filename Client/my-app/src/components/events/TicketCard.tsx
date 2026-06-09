import React from 'react';
import { EventRegistration } from '../../types';
import './TicketCard.css';

interface Props {
  ticket: EventRegistration;
}

const TicketCard: React.FC<Props> = ({ ticket }) => (
  <article className="ticket-card">
    <div className="ticket-header">
      <div>
        <h3>{ticket.eventDescription}</h3>
        <p className="ticket-id">מס׳ הזמנה: #{ticket.registrationId}</p>
      </div>
    </div>
    <div className="ticket-details">
      <p><strong>תאריך אירוע:</strong> {new Date(ticket.eventDate).toLocaleDateString('he-IL')}</p>
      <p><strong>כמות כרטיסים:</strong> {ticket.placesCount}</p>
      <p><strong>סה״כ שולם:</strong> {ticket.totalPrice} ₪</p>
      <p><strong>תאריך רכישה:</strong> {new Date(ticket.registrationDate).toLocaleDateString('he-IL')}</p>
      <span className={`ticket-status ${ticket.isPaid ? 'paid' : 'pending'}`}>
        {ticket.isPaid ? 'שולם' : 'ממתין לתשלום'}
      </span>
    </div>
  </article>
);

export default TicketCard;
