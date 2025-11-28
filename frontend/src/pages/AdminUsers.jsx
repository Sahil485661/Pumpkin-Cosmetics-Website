import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUserRole, deleteUser, clearSuccess, clearErrors } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';
import '../AdminStyles/UsersList.css';

function AdminUsers() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user: currentUser, isAuthenticated } = useSelector((state) => state.user);
    const { users, loading, error, success, message } = useSelector((state) => state.admin);
    const [selectedUserRole, setSelectedUserRole] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        if (!isAuthenticated || currentUser?.role !== 'admin') {
            navigate('/profile');
            return;
        }
        dispatch(getAllUsers());
    }, [isAuthenticated, currentUser, navigate, dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (success && message) {
            toast.success(message);
            dispatch(clearSuccess());
            dispatch(getAllUsers());
        }
    }, [success, message, dispatch]);

    const handleRoleChange = (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        setSelectedUserRole(prev => ({ ...prev, [userId]: newRole }));
    };

    const handleUpdateRole = (userId) => {
        const newRole = selectedUserRole[userId];
        if (newRole) {
            dispatch(updateUserRole({ id: userId, role: newRole }));
        }
    };

    const handleDeleteUser = (userId) => {
        if (deleteConfirm === userId) {
            dispatch(deleteUser(userId));
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(userId);
        }
    };

    if (!isAuthenticated || currentUser?.role !== 'admin') {
        return null;
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <PageTitle title="Manage Users" />
            <Navbar />
            <div className="admin-users-container">
                <div className="admin-header">
                    <h1>Manage Users</h1>
                    <p>Total Users: {users.length}</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="users-table-wrapper">
                    {users.length > 0 ? (
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td>#{u._id.substring(0, 6)}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`role-badge ${u.role}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${u.isVerified ? 'verified' : 'pending'}`}>
                                                {u.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <select
                                                    value={selectedUserRole[u._id] || u.role}
                                                    onChange={(e) => handleRoleChange(u._id, u.role)}
                                                    className="role-select"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <button
                                                    onClick={() => handleUpdateRole(u._id)}
                                                    className="btn-update"
                                                    disabled={!selectedUserRole[u._id] || selectedUserRole[u._id] === u.role}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className={`btn-delete ${deleteConfirm === u._id ? 'confirm' : ''}`}
                                                >
                                                    {deleteConfirm === u._id ? 'Confirm Delete' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-users">
                            <p>No users found</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default AdminUsers;
