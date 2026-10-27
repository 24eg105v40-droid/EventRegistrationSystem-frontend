import React, { useState, useEffect } from 'react';
import { X, Users, Search, Trash2, Mail, Clock, Calendar } from 'lucide-react';
import { registrationService } from '../services/registrationService';

const ParticipantsModal = ({ isOpen, onClose, event, onRegistrationRemoved, showToast }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const fetchParticipants = async () => {
    if (!event) return;
    try {
      setLoading(true);
      const data = await registrationService.getRegistrationsForEvent(event.id);
      setParticipants(data);
    } catch (err) {
      showToast('error', err.message || 'Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && event) {
      fetchParticipants();
      setSearchQuery('');
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const handleRemove = async (participant) => {
    const confirmed = window.confirm(`Remove ${participant.participantName} (${participant.participantEmail}) from this event?`);
    if (!confirmed) return;

    try {
      setRemovingId(participant.id);
      await registrationService.removeRegistration(participant.id);
      setParticipants((prev) => prev.filter((p) => p.id !== participant.id));
      showToast('success', `${participant.participantName} was removed from the event.`);
      if (onRegistrationRemoved) {
        onRegistrationRemoved(event.id);
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to remove registration.');
    } finally {
      setRemovingId(null);
    }
  };

  const filteredParticipants = participants.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.participantName.toLowerCase().includes(q) ||
      p.participantEmail.toLowerCase().includes(q)
    );
  });

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container modal-large">
        <div className="modal-header">
          <div>
            <div className="modal-title-with-badge">
              <h3>Registered Participants</h3>
              <span className="badge badge-accent">
                {participants.length} {participants.length === 1 ? 'student' : 'students'}
              </span>
            </div>
            <p className="modal-subtitle">Event: {event.name}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Top Filter and Search Bar */}
          <div className="participants-toolbar">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search participants by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading participants list...</p>
            </div>
          ) : participants.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Users size={40} />
              </div>
              <h4>No Participants Yet</h4>
              <p>No students have registered for this event so far. Share the registration link or register participants using the "Register" button.</p>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="empty-state">
              <p>No participants matched "{searchQuery}". Try a different keyword.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="participants-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Participant Name</th>
                    <th>Email Address</th>
                    <th>Registration Date</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((p, index) => (
                    <tr key={p.id}>
                      <td className="row-num">{index + 1}</td>
                      <td className="font-semibold text-primary">{p.participantName}</td>
                      <td>
                        <span className="email-link">
                          <Mail size={14} />
                          {p.participantEmail}
                        </span>
                      </td>
                      <td>
                        <span className="date-cell">
                          <Clock size={14} />
                          {formatDateTime(p.registeredAt)}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          className="btn-icon-danger"
                          title="Remove registration"
                          onClick={() => handleRemove(p)}
                          disabled={removingId === p.id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsModal;
