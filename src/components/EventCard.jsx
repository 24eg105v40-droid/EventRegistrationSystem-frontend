import React from 'react';
import { Calendar, MapPin, Users, Edit3, Trash2, UserPlus } from 'lucide-react';

const EventCard = ({
  event,
  onRegister,
  onViewParticipants,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const count = event.registrationCount || 0;

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div className="event-title-group">
          <h3 className="event-title" title={event.name}>
            {event.name}
          </h3>
          <span className={`reg-badge ${count > 0 ? 'reg-badge-active' : 'reg-badge-zero'}`}>
            <Users size={14} />
            <span>{count} {count === 1 ? 'Registration' : 'Registrations'}</span>
          </span>
        </div>

        <div className="event-meta-list">
          <div className="event-meta-item">
            <Calendar size={16} className="meta-icon" />
            <span className="meta-text">{formatDate(event.date)}</span>
          </div>
          <div className="event-meta-item">
            <MapPin size={16} className="meta-icon" />
            <span className="meta-text" title={event.venue}>{event.venue}</span>
          </div>
        </div>
      </div>

      <div className="event-card-body">
        <p className="event-description">
          {event.description}
        </p>
      </div>

      <div className="event-card-footer">
        <div className="card-actions-primary">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onRegister(event)}
          >
            <UserPlus size={16} />
            <span>Register</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onViewParticipants(event)}
          >
            <Users size={16} />
            <span>Participants ({count})</span>
          </button>
        </div>

        <div className="card-actions-secondary">
          <button
            className="btn-icon"
            title="Edit Event"
            onClick={() => onEdit(event)}
          >
            <Edit3 size={16} />
          </button>
          <button
            className="btn-icon btn-icon-danger"
            title="Delete Event"
            onClick={() => onDelete(event)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
