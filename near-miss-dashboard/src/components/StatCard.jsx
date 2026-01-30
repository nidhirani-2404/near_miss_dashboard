import React from 'react';
// import { LucideIcon } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color }) => {
    return (
        <div className="card">
            <div className="card-header">
                <span className="card-title">{title}</span>
                {Icon && <Icon size={24} color={color || 'var(--accent-color)'} />}
            </div>
            <div className="stat-value" style={{ color: color || 'var(--text-primary)' }}>
                {value.toLocaleString()}
            </div>
            {subtext && <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{subtext}</div>}
        </div>
    );
};

export default StatCard;
