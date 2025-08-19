import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { FaDownload, FaEye, FaCalendarAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import api from '../services/api';

const CompanyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/by-company.php');
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

  const updateStatus = async (id, status) => {
    try {
      await api.post('/applications/update_application_status.php', { id, status });
      setApplications(applications.map(app => 
        app.id === id ? {...app, status} : app
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Job Applications</h2>
      
      {applications.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h4>No applications yet</h4>
            <p>Applications for your jobs will appear here</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Job Position</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img 
                        src={`http://localhost/Jobconnect/backend/uploads/profile_images/${app.applicant_image}`} 

                        alt={app.name}
                        className="rounded-circle me-2"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      <span>{app.name}</span>
                    </div>
                  </td>
                  <td>{app.job_title}</td>
                  <td>
                    <div className="d-flex flex-column">
                      <small><FaEnvelope className="me-1" /> {app.email}</small>
                      <small><FaPhone className="me-1" /> {app.phone}</small>
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(app.status)}
                    <div className="mt-2 d-flex flex-wrap gap-1">
                      {app.status !== 'shortlisted' && (
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => updateStatus(app.id, 'shortlisted')}
                        >
                          Shortlist
                        </Button>
                      )}
                      {app.status !== 'rejected' && (
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => updateStatus(app.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      )}
                      {app.status !== 'hired' && (
                        <Button 
                          size="sm" 
                          variant="outline-success"
                          onClick={() => updateStatus(app.id, 'hired')}
                        >
                          Hire
                        </Button>
                      )}
                    </div>
                  </td>
                  <td>
                    <small>
                      <FaCalendarAlt className="me-1" />
                      {new Date(app.applied_at).toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => {
                        setSelectedApp(app);
                        setShowModal(true);
                      }}
                    >
                      <FaEye /> View
                    </Button>
                    <Button 
                      variant="success" 
                      size="sm"
                      href={app.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaDownload /> Resume
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Application Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Application for {selectedApp?.job_title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApp && (
            <div>
              <div className="d-flex align-items-center mb-4">
                <img 
                  src={selectedApp.applicant_image} 
                  alt={selectedApp.name}
                  className="rounded-circle me-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <div>
                  <h4>{selectedApp.name}</h4>
                  <div className="text-muted">
                    <p className="mb-1">
                      <FaEnvelope className="me-1" /> {selectedApp.email}
                    </p>
                    <p className="mb-0">
                      <FaPhone className="me-1" /> {selectedApp.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h5>Cover Letter</h5>
                <div className="bg-light p-3 rounded">
                  {selectedApp.cover_letter || "No cover letter provided"}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="me-2">Status:</span>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <Button 
                  variant="primary"
                  href={selectedApp.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDownload className="me-1" /> Download Resume
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CompanyApplications;