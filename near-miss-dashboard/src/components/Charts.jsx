import React, { useState, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Sector
} from 'recharts';

const COLORS = ['#38bdf8', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#64748b'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: '#1e293b', padding: '12px', border: '1px solid #334155', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                <p style={{ color: '#f8fafc', fontWeight: '600', marginBottom: '4px' }}>{label}</p>
                <p style={{ color: '#38bdf8', fontSize: '0.9rem' }}>
                    Count: <span style={{ color: '#fff', fontWeight: 'bold' }}>{payload[0].value.toLocaleString()}</span>
                </p>
            </div>
        );
    }
    return null;
};

// ----------------------------------------------------------------------
// Custom Shape for Donut Chart (Expanded Sector)
// ----------------------------------------------------------------------
const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

    return (
        <g>
            <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#f8fafc" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {payload.name}
            </text>
            <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#94a3b8" style={{ fontSize: '14px' }}>
                {value.toLocaleString()}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10} // Expand effect
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                stroke="#fff"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0px 0px 8px rgba(255,255,255,0.2))' }}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 10}
                outerRadius={outerRadius + 15}
                fill={fill}
                fillOpacity={0.3}
            />
        </g>
    );
};

// ----------------------------------------------------------------------
// Charts
// ----------------------------------------------------------------------

export const SeverityChart = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="card" style={{ height: '400px' }}>
            <div className="card-header">
                <span className="card-title">Incident Scatter by Severity</span>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data} onMouseLeave={() => setActiveIndex(null)}>
                    <defs>
                        <linearGradient id="colorSeverity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.3} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" fill="url(#colorSeverity)" radius={[4, 4, 0, 0]} onMouseEnter={(_, index) => setActiveIndex(index)}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={index === activeIndex ? '#38bdf8' : 'url(#colorSeverity)'}
                                style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const TrendChart = ({ data }) => (
    <div className="card" style={{ height: '400px', gridColumn: 'span 2' }}>
        <div className="card-header">
            <span className="card-title">Incidents Over Time (Monthly)</span>
        </div>
        <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTrend)"
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

export const CategoryChart = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = useCallback((_, index) => {
        setActiveIndex(index);
    }, []);

    return (
        <div className="card" style={{ height: '600px' }}>
            <div className="card-header">
                <span className="card-title">Top Primary Categories</span>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="40%" // Moved higher to leave room for bottom legend
                        innerRadius={80}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        paddingAngle={2}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                stroke="none"
                                fillOpacity={index === activeIndex ? 1 : 0.6}
                                style={{ transition: 'all 0.4s ease' }}
                            />
                        ))}
                    </Pie>
                    <Legend
                        verticalAlign="bottom"
                        height={100} // Allocated space for legend
                        wrapperStyle={{ overflowY: 'auto', bottom: 10 }} // Scrollable if huge
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export const RegionChart = ({ data }) => {
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div className="card" style={{ height: '500px', gridColumn: 'span 2' }}>
            <div className="card-header">
                <span className="card-title">Incidents by Region</span>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data} layout="vertical" margin={{ left: 20 }} onMouseLeave={() => setHoverIndex(null)}>
                    <defs>
                        <linearGradient id="colorRegion" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#d946ef" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} opacity={0.5} />
                    <XAxis type="number" stroke="#94a3b8" hide />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={150} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24} onMouseEnter={(_, idx) => setHoverIndex(idx)}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={index === hoverIndex ? '#d946ef' : 'url(#colorRegion)'}
                                style={{ transition: 'all 0.3s ease' }}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const CauseChart = ({ data }) => {
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div className="card" style={{ height: '600px', gridColumn: 'span 1' }}>
            <div className="card-header">
                <span className="card-title">Top Action Causes</span>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data} layout="vertical" margin={{ left: 5 }} onMouseLeave={() => setHoverIndex(null)}>
                    <defs>
                        <linearGradient id="colorCause" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} opacity={0.5} />
                    <XAxis type="number" stroke="#94a3b8" hide />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} onMouseEnter={(_, idx) => setHoverIndex(idx)}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={index === hoverIndex ? '#fbbf24' : 'url(#colorCause)'}
                                style={{ transition: 'all 0.3s ease' }}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
