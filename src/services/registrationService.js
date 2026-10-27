import api from './api';

export const registrationService = {
  // Retrieve all participants registered for an event
  getRegistrationsForEvent: async (eventId) => {
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data;
  },

  // Register a student participant for an event
  registerParticipant: async (eventId, participantData) => {
    const response = await api.post(`/events/${eventId}/registrations`, participantData);
    return response.data;
  },

  // Remove a registration by ID
  removeRegistration: async (registrationId) => {
    const response = await api.delete(`/registrations/${registrationId}`);
    return response.data;
  },

  // Get registration count for an event
  getRegistrationCount: async (eventId) => {
    const response = await api.get(`/events/${eventId}/registrations/count`);
    return response.data;
  },
};
