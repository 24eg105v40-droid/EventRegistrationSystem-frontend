import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, AlignLeft, Tag } from 'lucide-react';

const EventModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    venue: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        date: initialData.date || '',
        venue: initialData.venue || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        date: '',
        venue: '',
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Event name must be at least 3 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    } else if (formData.venue.trim().length < 2) {
      newErrors.venue = 'Venue must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
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
    onSubmit(formData);
  };

  const isEditing = Boolean(initialData && initialData.id);

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{isEditing ? 'Edit College Event' : 'Create New College Event'}</h3>
          <button className="modal-close-btn" onClick={onClose} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <Tag size={16} /> Event Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Annual College Hackathon 2026"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  <Calendar size={16} /> Event Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className={`form-input ${errors.date ? 'input-error' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="venue" className="form-label">
                  <MapPin size={16} /> Venue / Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  className={`form-input ${errors.venue ? 'input-error' : ''}`}
                  placeholder="e.g. Main Auditorium & Tech Lab"
                  value={formData.venue}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.venue && <span className="error-text">{errors.venue}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <AlignLeft size={16} /> Event Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                placeholder="Provide a comprehensive summary of the event, eligibility, agenda, and guidelines..."
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
