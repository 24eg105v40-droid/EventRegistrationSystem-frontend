import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container modal-small">
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <div className="warning-icon-wrapper">
              <AlertTriangle size={20} className="warning-icon" />
            </div>
            <h3>{title || 'Confirm Deletion'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onCancel} disabled={isDeleting}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-text">{message || 'Are you sure you want to delete this record? This action cannot be undone.'}</p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
