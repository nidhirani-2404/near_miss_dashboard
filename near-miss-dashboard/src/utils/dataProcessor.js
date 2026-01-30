import rawData from '../assets/near_miss_dataset.json';

// Helper to reliably get string value
const safeStr = (val) => (val ? String(val).trim() : 'Unknown');

console.log('Raw Data Import:', rawData);

export const processData = () => {
    if (!Array.isArray(rawData)) {
        console.error('Data invalid: rawData is not an array', rawData);
        return { stats: { total: 0, highSeverity: 0, openCases: 0, locations: 0 }, charts: { severity: [], monthly: [], category: [], region: [], cause: [] } };
    }

    const totalRecords = rawData.length;

    // High Level Stats
    const severityBreakdown = rawData.reduce((acc, curr) => {
        const level = curr.severity_level ?? 'Unknown';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});

    const monthlyIncidents = rawData.reduce((acc, curr) => {
        // Assuming 'month' field exists and is 1-12
        const month = curr.month ? `Month ${curr.month}` : 'Unknown';
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    // For charts, we usually need arrays of objects
    const severityChartData = Object.entries(severityBreakdown).map(([name, value]) => ({
        name: `Level ${name}`,
        value,
    })).sort((a, b) => a.name.localeCompare(b.name));

    const monthlyChartData = Object.entries(monthlyIncidents).map(([name, value]) => ({
        name,
        value,
    })).sort((a, b) => {
        // Basic sort for "Month X"
        const numA = parseInt(a.name.replace('Month ', '')) || 0;
        const numB = parseInt(b.name.replace('Month ', '')) || 0;
        return numA - numB;
    });

    const categories = rawData.reduce((acc, curr) => {
        const cat = safeStr(curr.primary_category);
        if (cat === '') return acc; // Skip empty
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const categoryChartData = Object.entries(categories)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8); // Top 8

    const regions = rawData.reduce((acc, curr) => {
        const reg = safeStr(curr.region);
        acc[reg] = (acc[reg] || 0) + 1;
        return acc;
    }, {});

    const regionChartData = Object.entries(regions)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const causes = rawData.reduce((acc, curr) => {
        const cause = safeStr(curr.action_cause);
        acc[cause] = (acc[cause] || 0) + 1;
        return acc;
    }, {});

    const causeChartData = Object.entries(causes)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // Top 10

    return {
        stats: {
            total: totalRecords,
            highSeverity: (severityBreakdown[4] || 0) + (severityBreakdown[5] || 0), // Assuming 4-5 is high
            openCases: totalRecords, // Dataset doesn't seem to have status, so generic placeholder or check specific field
            locations: Object.keys(regions).length
        },
        charts: {
            severity: severityChartData,
            monthly: monthlyChartData,
            category: categoryChartData,
            region: regionChartData,
            cause: causeChartData
        }
    };
};
