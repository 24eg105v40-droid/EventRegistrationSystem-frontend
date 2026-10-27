import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => {
  return (
    <div className={`stat-card ${colorClass || ''}`}>
      <div className="stat-content">
        <div className="stat-header">
          <span className="stat-title">{title}</span>
          {Icon && (
            <div className="stat-icon-box">
              <Icon size={22} />
            </div>
          )}
        </div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
