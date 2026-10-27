import React from 'react';
import { Calendar, Users, Award, AlertCircle, TrendingUp, PlusCircle, ArrowRight } from 'lucide-react';
import StatCard from '../components/StatCard';

const Dashboard = ({
  summary,
  events,
  onNavigateToEvents,
  onOpenCreateModal,
  onRegister,
  onViewParticipants,
}) => {
  const totalEvents = summary ? summary.totalEvents : events.length;
  const totalRegistrations = summary ? summary.totalRegistrations : 0;
  const zeroRegistrations = summary ? summary.eventsWithNoRegistrations : 0;
  const mostPopularEvent = summary ? summary.mostPopularEvent : 'None';
  const mostPopularCount = summary ? summary.mostPopularEventCount : 0;

  // Sorted events by registration count descending
  const sortedByRegistrations = [...events].sort(
    (a, b) => (b.registrationCount || 0) - (a.registrationCount || 0)
  );

  const topEvents = sortedByRegistrations.filter((e) => (e.registrationCount || 0) > 0).slice(0, 4);
  const zeroRegEvents = events.filter((e) => (e.registrationCount || 0) === 0);

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h2>College Event Management & Analytics</h2>
          <p>
            Monitor real-time student registrations, manage upcoming campus events, and track participant turnout across departments.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={onOpenCreateModal}>
              <PlusCircle size={18} />
              <span>Create Event</span>
            </button>
            <button className="btn btn-secondary-white" onClick={onNavigateToEvents}>
              <span>Browse All Events</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={Calendar}
          colorClass="stat-blue"
          subtitle="Active campus events organized"
        />
        <StatCard
          title="Total Registrations"
          value={totalRegistrations}
          icon={Users}
          colorClass="stat-indigo"
          subtitle="Student enrollments across all events"
        />
        <StatCard
          title="Top Participating Event"
          value={mostPopularEvent}
          icon={Award}
          colorClass="stat-amber"
          subtitle={`${mostPopularCount} student${mostPopularCount === 1 ? '' : 's'} registered`}
        />
        <StatCard
          title="Events With 0 Registrations"
          value={zeroRegistrations}
          icon={AlertCircle}
          colorClass="stat-rose"
          subtitle="Events requiring student outreach"
        />
      </div>

      {/* Two Column Grid: Top Performing vs Need Attention */}
      <div className="dashboard-grid-2">
        {/* Top Participating Events */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-with-icon">
              <TrendingUp size={20} className="text-primary" />
              <h3>Most Popular Events</h3>
            </div>
            <span className="badge badge-accent">By Registrations</span>
          </div>

          <div className="panel-body">
            {topEvents.length === 0 ? (
              <p className="text-muted text-center py-4">No events have received registrations yet.</p>
            ) : (
              <div className="ranked-event-list">
                {topEvents.map((ev, idx) => (
                  <div key={ev.id} className="ranked-event-item">
                    <div className="rank-badge">{idx + 1}</div>
                    <div className="rank-info">
                      <div className="rank-name">{ev.name}</div>
                      <div className="rank-meta">{ev.venue} • {ev.date}</div>
                    </div>
                    <div className="rank-actions">
                      <span className="rank-count">{ev.registrationCount} registered</span>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => onViewParticipants(ev)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Events with 0 registrations */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-with-icon">
              <AlertCircle size={20} className="text-warning" />
              <h3>Events Awaiting Registrations</h3>
            </div>
            <span className="badge badge-warning">{zeroRegEvents.length} Pending</span>
          </div>

          <div className="panel-body">
            {zeroRegEvents.length === 0 ? (
              <p className="text-muted text-center py-4">
                🎉 Great news! All college events have at least one registered participant.
              </p>
            ) : (
              <div className="ranked-event-list">
                {zeroRegEvents.slice(0, 4).map((ev) => (
                  <div key={ev.id} className="ranked-event-item">
                    <div className="rank-info">
                      <div className="rank-name">{ev.name}</div>
                      <div className="rank-meta">{ev.venue} • {ev.date}</div>
                    </div>
                    <div className="rank-actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onRegister(ev)}
                      >
                        Register Student
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
