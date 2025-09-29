// Auth APIs
export async function logout() {
    const res = await fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    if (!res.ok) throw new Error('Logout failed');
    return res.json();
}
// Upcoming Conflicts APIs
export async function fetchUpcomingConflicts() {
    const res = await fetch(`${BASE_URL}/api/upcoming-conflicts`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch upcoming conflicts');
    return res.json();
}
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Train APIs
export async function fetchTrainDetails(trainId: string) {
    const res = await fetch(`${BASE_URL}/api/trains/${trainId}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch train details');
    return res.json();
}

export async function searchTrains(query: string) {
    const res = await fetch(`${BASE_URL}/api/trains/search?q=${encodeURIComponent(query)}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to search trains');
    return res.json();
}

export async function fetchAllTrains() {
    const res = await fetch(`${BASE_URL}/api/trains`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch trains');
    return res.json();
}

// Conflicts APIs
export async function fetchConflicts() {
    const res = await fetch(`${BASE_URL}/api/conflicts`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch conflicts');
    return res.json();
}

export async function applyConflictSuggestion(conflictId: string, suggestion: { action: string; benefit: string; risk: string; }) {
    const res = await fetch(`${BASE_URL}/api/conflicts/${conflictId}/suggestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(suggestion)
    });
    if (!res.ok) throw new Error('Failed to apply suggestion');
    return res.json();
}

// Alerts APIs
export async function fetchAlerts() {
    const res = await fetch(`${BASE_URL}/api/alerts`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
}

export async function acknowledgeAlert(alertId: string) {
    const res = await fetch(`${BASE_URL}/api/alerts/${alertId}/acknowledge`, { method: 'POST', credentials: 'include' });
    if (!res.ok) throw new Error('Failed to acknowledge alert');
    return res.json();
}

// Reports APIs
export async function fetchReports() {
    const res = await fetch(`${BASE_URL}/api/reports`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
}

// Add more API functions here as needed
