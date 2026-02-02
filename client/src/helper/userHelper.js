// Helper for filtering users in admin UI
export function filterUsers(users = [], query = '', status = 'all') {
    if (!users) return [];
    const q = (query || '').trim().toLowerCase();
    return users.filter((u) => {
        if (!u) return false;
        if (status === 'active' && u.isBlocked) return false;
        if (status === 'blocked' && !u.isBlocked) return false;

        if (!q) return true;
        const name = (u.name || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const phone = (u.phone || '').toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q);
    });
}

export default filterUsers;
