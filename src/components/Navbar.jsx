import React from 'react';
import { Calendar, PlusCircle, LayoutDashboard, Sparkles } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, onOpenCreateModal }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => setActiveTab('events')}>
          <div className="brand-icon-wrapper">
            <Calendar className="brand-icon" size={24} />
          </div>
          <div>
            <div className="brand-title">CampusEventHub</div>
            <div className="brand-subtitle">College Event Registration System</div>
          </div>
        </div>

        <nav className="navbar-nav">
          <button
            className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Sparkles size={18} />
            <span>Events Directory</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
        </nav>

        <div className="navbar-actions">
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            <PlusCircle size={18} />
            <span>Add Event</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
