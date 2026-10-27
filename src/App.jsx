import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EventsPage from './pages/EventsPage';
import EventModal from './components/EventModal';
import RegistrationModal from './components/RegistrationModal';
import ParticipantsModal from './components/ParticipantsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { eventService } from './services/eventService';
import { registrationService } from './services/registrationService';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'dashboard'
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Event Modal (Create / Edit) State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  // Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);

  // Participants Modal State
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [viewingParticipantsEvent, setViewingParticipantsEvent] = useState(null);

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch all events and dashboard summary
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventsData, summaryData] = await Promise.all([
        eventService.getAllEvents(),
        eventService.getDashboardSummary().catch(() => null),
      ]);
      setEvents(eventsData);
      setSummary(summaryData);
    } catch (err) {
      showToast('error', err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Event Modal Open
  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  // Handle Event Save (Create / Update)
  const handleSaveEvent = async (formData) => {
    try {
      setIsSubmittingEvent(true);
      if (editingEvent && editingEvent.id) {
        await eventService.updateEvent(editingEvent.id, formData);
        showToast('success', `Event "${formData.name}" was successfully updated.`);
      } else {
        await eventService.createEvent(formData);
        showToast('success', `Event "${formData.name}" was successfully created.`);
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
      await loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to save event.');
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  // Handle Registration Modal Open
  const handleOpenRegisterModal = (event) => {
    setRegisteringEvent(event);
    setIsRegisterModalOpen(true);
  };

  // Handle Registration Submit
  const handleRegisterParticipant = async (eventId, participantData) => {
    try {
      setIsSubmittingRegistration(true);
      const result = await registrationService.registerParticipant(eventId, participantData);
      showToast('success', `Congratulations ${result.participantName}! You have successfully registered.`);
      setIsRegisterModalOpen(false);
      setRegisteringEvent(null);
      await loadData();
    } catch (err) {
      showToast('error', err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  // Handle Participants Modal Open
  const handleOpenParticipantsModal = (event) => {
    setViewingParticipantsEvent(event);
    setIsParticipantsModalOpen(true);
  };

  // Callback when a participant is deleted in ParticipantsModal
  const handleRegistrationRemoved = async (eventId) => {
    await loadData();
    // Update local reference to viewing event if modal is open
    setViewingParticipantsEvent((prev) => {
      if (!prev || prev.id !== eventId) return prev;
      return {
        ...prev,
        registrationCount: Math.max(0, (prev.registrationCount || 1) - 1),
      };
    });
  };

  // Handle Event Delete Trigger
  const handleOpenDeleteModal = (event) => {
    setDeletingEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteEvent = async () => {
    if (!deletingEvent) return;
    try {
      setIsDeleting(true);
      await eventService.deleteEvent(deletingEvent.id);
      showToast('success', `Event "${deletingEvent.name}" has been deleted.`);
      setIsDeleteModalOpen(false);
      setDeletingEvent(null);
      await loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete event.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast notification={toast} onClose={closeToast} />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'events' ? (
          <EventsPage
            events={events}
            loading={loading}
            onOpenCreateModal={handleOpenCreateModal}
            onRegister={handleOpenRegisterModal}
            onViewParticipants={handleOpenParticipantsModal}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        ) : (
          <Dashboard
            summary={summary}
            events={events}
            onNavigateToEvents={() => setActiveTab('events')}
            onOpenCreateModal={handleOpenCreateModal}
            onRegister={handleOpenRegisterModal}
            onViewParticipants={handleOpenParticipantsModal}
          />
        )}
      </main>

      {/* Modals */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSubmit={handleSaveEvent}
        initialData={editingEvent}
        isSubmitting={isSubmittingEvent}
      />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSubmit={handleRegisterParticipant}
        event={registeringEvent}
        isSubmitting={isSubmittingRegistration}
      />

      <ParticipantsModal
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        event={viewingParticipantsEvent}
        onRegistrationRemoved={handleRegistrationRemoved}
        showToast={showToast}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete College Event"
        message={
          deletingEvent
            ? `Are you sure you want to delete "${deletingEvent.name}"? All registered participants for this event will also be removed.`
            : 'Are you sure you want to delete this event?'
        }
        onConfirm={handleConfirmDeleteEvent}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>
            <strong>College Event Registration System</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
