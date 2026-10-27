import React, { useState, useEffect } from 'react';
import { X, User, Mail, Calendar, MapPin, CheckCircle } from 'lucide-react';

const RegistrationModal = ({ isOpen, onClose, onSubmit, event, isSubmitting }) => {
  const [formData, setFormData] = useState({
    participantName: '',
    participantEmail: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      participantName: '',
      participantEmail: '',
    });
    setErrors({});
  }, [event, isOpen]);

  if (!isOpen || !event) return null;

  const validate = () => {
    const newErrors = {};
    const nameTrim = formData.participantName.trim();
    const emailTrim = formData.participantEmail.trim();

    if (!nameTrim) {
      newErrors.participantName = 'Full name is required';
    } else if (nameTrim.length < 2) {
      newErrors.participantName = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrim) {
      newErrors.participantEmail = 'Email address is required';
    } else if (!emailRegex.test(emailTrim)) {
      newErrors.participantEmail = 'Please enter a valid email address (e.g. student@college.edu)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(event.id, formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <div>
            <h3>Register for Event</h3>
            <p className="modal-subtitle">Enroll as a participant in {event.name}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        {/* Event Quick Info Banner */}
        <div className="event-info-banner">
          <div className="info-banner-title">{event.name}</div>
          <div className="info-banner-meta">
            <span className="banner-item">
              <Calendar size={15} />
              {event.date}
            </span>
            <span className="banner-item">
              <MapPin size={15} />
              {event.venue}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="participantName" className="form-label">
                <User size={16} /> Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="participantName"
                name="participantName"
                className={`form-input ${errors.participantName ? 'input-error' : ''}`}
                placeholder="e.g. Rohan Sharma"
                value={formData.participantName}
                onChange={handleChange}
                disabled={isSubmitting}
                autoFocus
              />
              {errors.participantName && (
                <span className="error-text">{errors.participantName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="participantEmail" className="form-label">
                <Mail size={16} /> Student Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="participantEmail"
                name="participantEmail"
                className={`form-input ${errors.participantEmail ? 'input-error' : ''}`}
                placeholder="e.g. rohan.sharma@college.edu"
                value={formData.participantEmail}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.participantEmail && (
                <span className="error-text">{errors.participantEmail}</span>
              )}
              <span className="form-hint">
                Confirmation details and event updates will be sent to this email.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
