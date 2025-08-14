import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup, Badge, Modal, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash, FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';
import api from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/admin/user_get.php', { withCredentials: true });
        if (res.data.success) {
          setUsers(res.data.users);
          setFilteredUsers(res.data.users);
        } else {
          setError(res.data.message || 'Failed to fetch users');
        }
      } catch (err) {
        setError(`Error fetching users: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users
  useEffect(() => {
    const results = users.filter(user => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    setFilteredUsers(results);
  }, [searchTerm, roleFilter, users]);

  // Delete
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      const res = await api.delete(`/admin/user_delete.php?id=${selectedUser.id}`);
      if (res.data.success) {
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setShowDeleteModal(false);
      } else {
        setError(res.data.message || 'Failed to delete user');
      }
    } catch (err) {
      setError(`Error deleting user: ${err.message}`);
    }
  };

  // Role Change
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.post(`/admin/user_role_update.php`, { id: userId, role: newRole });
      if (res.data.success) {
        setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        setError(res.data.message || 'Failed to update role');
      }
    } catch (err) {
      setError(`Error updating role: ${err.message}`);
    }
  };

  // Role Badge
  const getRoleBadge = (role) => {
    const variants = { admin: 'danger', company: 'warning', user: 'primary' };
    const icons = {
      admin: <FaUserShield className="me-1" />,
      company: <FaUserTie className="me-1" />,
      user: <FaUser className="me-1" />
    };

    return (
      <Badge bg={variants[role] || 'secondary'} className="d-flex align-items-center">
        {icons[role] || null}
        {role}
      </Badge>
    );
  };

  return (
    <div className="user-management-container">
      <h2 className="mb-4">User Management</h2>

      {/* Filters */}
      <div className="user-filters mb-4 p-3 bg-light rounded">
        <Row>
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name, email or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6}>
            <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="company">Company</option>
              <option value="user">User</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading users...</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name || 'N/A'}</td>
                      <td>{user.email || 'N/A'}</td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="company">Company</option>
                          <option value="admin">Admin</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(user)}
                          className="me-2"
                        >
                          <FaTrash />
                        </Button>
                        <Button variant="outline-primary" size="sm">
                          <FaEdit />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No users found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted">
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user:
          <strong> {selectedUser?.name || selectedUser?.email} </strong>?
          <div className="mt-2">
            {selectedUser?.role && getRoleBadge(selectedUser.role)}
            <span className="ms-2">ID: {selectedUser?.id}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
