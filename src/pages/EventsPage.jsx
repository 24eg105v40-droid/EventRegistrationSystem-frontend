import React, { useState, useMemo } from 'react';
import { Search, PlusCircle, Filter, Calendar, X, AlertCircle } from 'lucide-react';
import EventCard from '../components/EventCard';

const EventsPage = ({
  events,
  loading,
  onOpenCreateModal,
  onRegister,
  onViewParticipants,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, HAS_REG, ZERO_REG
  const [sortBy, setSortBy] = useState('DATE_ASC'); // DATE_ASC, REG_DESC, NAME_ASC

  const filteredEvents = useMemo(() => {
    return events
      .filter((ev) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          ev.name.toLowerCase().includes(query) ||
          ev.venue.toLowerCase().includes(query) ||
          ev.description.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        const count = ev.registrationCount || 0;
        if (filterType === 'HAS_REG') return count > 0;
        if (filterType === 'ZERO_REG') return count === 0;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'REG_DESC') {
          return (b.registrationCount || 0) - (a.registrationCount || 0);
        }
        if (sortBy === 'NAME_ASC') {
          return a.name.localeCompare(b.name);
        }
        // DATE_ASC default
        return new Date(a.date) - new Date(b.date);
      });
  }, [events, searchTerm, filterType, sortBy]);

  return (
    <div className="events-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">College Events Directory</h2>
          <p className="page-subtitle">
            Explore available technical, cultural, and sports events. Register students or manage event logistics.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenCreateModal}>
          <PlusCircle size={18} />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="search-filters-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search events by title, venue, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filters-group">
          {/* Filter Pills */}
          <div className="filter-pills">
            <button
              className={`pill-btn ${filterType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              All Events ({events.length})
            </button>
            <button
              className={`pill-btn ${filterType === 'HAS_REG' ? 'active' : ''}`}
              onClick={() => setFilterType('HAS_REG')}
            >
              With Registrations ({events.filter((e) => (e.registrationCount || 0) > 0).length})
            </button>
            <button
              className={`pill-btn ${filterType === 'ZERO_REG' ? 'active' : ''}`}
              onClick={() => setFilterType('ZERO_REG')}
            >
              No Registrations ({events.filter((e) => (e.registrationCount || 0) === 0).length})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-dropdown-wrapper">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="DATE_ASC">Sort by: Date (Earliest)</option>
              <option value="REG_DESC">Sort by: Most Registrations</option>
              <option value="NAME_ASC">Sort by: Event Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading college events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state card-empty">
          <div className="empty-state-icon">
            <Calendar size={48} />
          </div>
          <h3>No Events Found</h3>
          <p>
            {searchTerm || filterType !== 'ALL'
              ? 'No events match your current filter or search criteria.'
              : 'There are currently no college events scheduled. Click the button below to add the first event.'}
          </p>
          {(searchTerm || filterType !== 'ALL') ? (
            <button
              className="btn btn-secondary mt-3"
              onClick={() => {
                setSearchTerm('');
                setFilterType('ALL');
              }}
            >
              Clear Filters
            </button>
          ) : (
            <button className="btn btn-primary mt-3" onClick={onOpenCreateModal}>
              <PlusCircle size={18} />
              <span>Create Event</span>
            </button>
          )}
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={onRegister}
              onViewParticipants={onViewParticipants}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
