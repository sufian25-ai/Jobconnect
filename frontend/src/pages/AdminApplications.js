import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { FaDownload, FaEye, FaCalendarAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import api from '../services/api';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/admin/applications_admin.php');
        if (res.data.success) {
          setApplications(res.data.applications);
        } else {
          setError(res.data.message || 'Failed to load applications');
        }
      } catch (err) {
        setError('Error loading applications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      reviewed: 'info',
      shortlisted: 'primary',
      rejected: 'danger',
      hired: 'success'
    };
    return <Badge bg={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /><p>Loading applications...</p></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">All Job Applications</h2>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Job</th>
            <th>Company</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No applications found</td>
            </tr>
          ) : (
            applications.map(app => (
              <tr key={app.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={app.applicant_image_url}
                      alt={app.name}
                      className="rounded-circle me-2"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    {app.name || app.applicant_name}
                  </div>
                </td>
                <td>{app.job_title}</td>
                <td>{app.company_name}</td>
                <td>
                  <small><FaEnvelope className="me-1"/> {app.email || app.applicant_email}</small><br/>
                  <small><FaPhone className="me-1"/> {app.phone}</small>
                </td>
                <td>{getStatusBadge(app.status)}</td>
                <td><FaCalendarAlt className="me-1"/>{new Date(app.applied_at).toLocaleDateString()}</td>
                <td>
                  <Button size="sm" variant="primary" className="me-2" onClick={() => { setSelectedApp(app); setShowModal(true); }}>
                    <FaEye /> View
                  </Button>
                  <Button size="sm" variant="success" href={app.resume_url} target="_blank" rel="noopener noreferrer">
                    <FaDownload /> Resume
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApp && (
            <div>
              <h5>{selectedApp.job_title} - {selectedApp.company_name}</h5>
              <div className="d-flex align-items-center my-3">
                <img src={selectedApp.applicant_image_url} alt={selectedApp.name} className="rounded-circle me-3" style={{width: '80px', height:'80px', objectFit:'cover'}} />
                <div>
                  <p><FaEnvelope className="me-1"/> {selectedApp.email || selectedApp.applicant_email}</p>
                  <p><FaPhone className="me-1"/> {selectedApp.phone}</p>
                </div>
              </div>
              <div className="mb-3">
                <h6>Cover Letter</h6>
                <div className="p-3 bg-light rounded">{selectedApp.cover_letter || 'No cover letter provided'}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>Status: {getStatusBadge(selectedApp.status)}</div>
                <Button variant="success" href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer">
                  <FaDownload className="me-1"/> Download Resume
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminApplications;
