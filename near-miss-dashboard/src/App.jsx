import React, { useMemo, useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, MapPin, BarChart3, Sun, Moon } from 'lucide-react';
import StatCard from './components/StatCard';
import { SeverityChart, TrendChart, CategoryChart, RegionChart, CauseChart } from './components/Charts';
import { processData } from './utils/dataProcessor';

function App() {
  const [theme, setTheme] = useState('dark');

  // Toggle Theme Logic
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const { stats, charts } = useMemo(() => {
    try {
      return processData();
    } catch (e) {
      console.error("Data processing failed:", e);
      return {
        stats: { total: 0, highSeverity: 0, openCases: 0, locations: 0 },
        charts: { severity: [], monthly: [], category: [], region: [], cause: [] }
      };
    }
  }, []);

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'var(--accent-color)', borderRadius: '12px', color: '#fff' }}>
            <BarChart3 size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em' }}>Near Miss Analytics</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Real-time safety incident monitoring and analysis</p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '10px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            transition: 'all 0.2s'
          }}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </header>

      {/* Stats Row */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <StatCard
          title="Total Incidents"
          value={stats.total}
          icon={Activity}
          subtext="Recorded near miss events"
        />
        <StatCard
          title="High Severity (4-5)"
          value={stats.highSeverity}
          icon={AlertTriangle}
          color="var(--danger)"
          subtext="Critical incidents requiring attention"
        />
        <StatCard
          title="Active Projects"
          value={stats.locations}
          icon={MapPin}
          color="var(--warning)"
          subtext="Across all regions"
        />
        <StatCard
          title="Open Cases"
          value={stats.openCases}
          icon={CheckCircle}
          color="var(--success)"
          subtext="Incidents currently being processed"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="dashboard-grid">
        <div className="col-span-2">
          <TrendChart data={charts.monthly} />
        </div>
        <SeverityChart data={charts.severity} />

        <CategoryChart data={charts.category} />
        <div className="col-span-2">
          <RegionChart data={charts.region} />
        </div>

        <CauseChart data={charts.cause} />
      </div>

    </div>
  );
}

export default App;
