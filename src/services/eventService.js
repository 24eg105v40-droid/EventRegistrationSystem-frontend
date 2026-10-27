import api from './api';

export const eventService = {
  // Retrieve all events with participant counts
  getAllEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // Retrieve single event by ID
  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create a new event
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Update existing event details
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete an event
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Retrieve dashboard summary stats
  getDashboardSummary: async () => {
    const response = await api.get('/events/summary');
    return response.data;
  },
};
