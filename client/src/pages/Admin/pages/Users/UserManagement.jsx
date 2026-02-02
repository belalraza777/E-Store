import React, { useEffect, useState, useMemo } from 'react';
import './UserManagement.css';
import Skeleton from '../../../../components/ui/Skeleton/Skeleton.jsx';
import useProfileStore from '../../../../store/profileStore.js';
import { FiUser, FiTrash2, FiLock, FiUnlock } from 'react-icons/fi';
import { filterUsers } from '../../../../helper/userHelper.js';
import { toast } from 'sonner';


export default function UserManagement() {
    const { users, usersLoading, fetchUsers, blockUserAdmin, unblockUserAdmin, error } = useProfileStore();
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all | active | blocked

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Show toast for errors only when `error` changes
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Handlers for block
    const handleBlock = async (id) => {
        try {
            const ok = window.confirm('Are you sure you want to block this user? This will prevent them from logging in.');
            if (!ok) return;
            await blockUserAdmin(id);
            toast.success("User blocked successfully");
        } catch (error) {
            toast.error("Failed to block user");
        }
    };
    // Handlers for unblock
    const handleUnblock = async (id) => {
        try {
            const ok = window.confirm('Unblock this user and restore their access?');
            if (!ok) return;
            await unblockUserAdmin(id);
            toast.success("User unblocked successfully");
        } catch (error) {
            toast.error("Failed to unblock user");
        }
    };

    // Derived filtered list (from helper)
    const filteredUsers = useMemo(() => filterUsers(users, query, statusFilter), [users, query, statusFilter]);

    if (usersLoading && (!users || users.length === 0)) {
        return (
            <div className="admin-users-page">
                <Skeleton variant="text" width="100%" />
            </div>
        );
    }


    return (
        <div className="admin-users-page">
            <header className="admin-users-page__header">
                <h1><FiUser /> Users Management</h1>
                <p>View, block and unblock customers.</p>
            </header>

            <div className="admin-users-page__filters">
                <input
                    type="search"
                    placeholder="Search by name, email or phone"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="admin-users-page__search"
                />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-users-page__select">
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            <div className="admin-users-page__table-card">
                <table className="admin-users-page__table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Joined</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers && filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => (
                                <tr key={u._id} className={u.isBlocked ? 'admin-users-page__row--blocked' : ''}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone || '—'}</td>
                                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                                    <td>{u.isBlocked ? 'Blocked' : 'Active'}</td>
                                    <td>
                                        {u.isBlocked ? (
                                            <button className="admin-users-page__btn admin-users-page__btn--unblock" onClick={() => handleUnblock(u._id)} title="Unblock">
                                                <FiUnlock /> Unblock
                                            </button>
                                        ) : (
                                            <button className="admin-users-page__btn admin-users-page__btn--block" onClick={() => handleBlock(u._id)} title="Block">
                                                <FiLock /> Block
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

