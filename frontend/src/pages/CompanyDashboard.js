import React, { useEffect, useState } from "react";
import api from "../services/api";
import { 
  Button, 
  Card, 
  Container, 
  Row, 
  Col, 
  Badge, 
  Alert, 
  Spinner,
  Dropdown,
  Modal,
  Form
} from "react-bootstrap";
import { 
  useNavigate, 
  Link 
} from "react-router-dom";
import { 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiCalendar, 
  FiDollarSign, 
  FiMapPin, 
  FiBriefcase,
  FiFilter,
  FiRefreshCw
} from "react-icons/fi";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

const CompanyDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    if (!user || user.role !== "company") {
      navigate("/login");
    } else {
      fetchJobs();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/jobs/company_jobs.php?company_id=${user.company_id}`);
      
      if (res.data?.jobs) {
        setJobs(res.data.jobs);
        calculateStats(res.data.jobs);
      } else {
        setError("No jobs found");
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (jobs) => {
    setStats({
      total: jobs.length,
      approved: jobs.filter(job => job.status === "approved").length,
      pending: jobs.filter(job => job.status === "pending").length,
      rejected: jobs.filter(job => job.status === "rejected").length
    });
  };

  const confirmDelete = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const deleteJob = async () => {
    try {
      const res = await api.post("/jobs/delete.php", { id: jobToDelete.id });
      if (res.data.success) {
        setJobs(jobs.filter((job) => job.id !== jobToDelete.id));
        calculateStats(jobs.filter((job) => job.id !== jobToDelete.id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete job. Please try again.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge bg="success" className="d-flex align-items-center gap-1">
          <FiEye size={14} /> Approved
        </Badge>;
      case "pending":
        return <Badge bg="warning" className="d-flex align-items-center gap-1">
          <FiCalendar size={14} /> Pending
        </Badge>;
      case "rejected":
        return <Badge bg="danger" className="d-flex align-items-center gap-1">
          <FiBriefcase size={14} /> Rejected
        </Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy", { locale: enUS });
  };

  const formatSalary = (salary) => {
    if (!salary) return "Negotiable";
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(salary);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Job Management Dashboard</h2>
          <p className="text-muted mb-0">
            {stats.total} total jobs • {stats.approved} approved • {stats.pending} pending
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate("/post-job")}
          className="d-flex align-items-center gap-2"
        >
          <FiEdit2 size={18} /> Post New Job
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                <FiBriefcase size={24} className="text-primary" />
              </div>
              <div>
                <h6 className="mb-0">Total Jobs</h6>
                <h3 className="mb-0">{stats.total}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                <FiEye size={24} className="text-success" />
              </div>
              <div>
                <h6 className="mb-0">Approved</h6>
                <h3 className="mb-0">{stats.approved}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                <FiCalendar size={24} className="text-warning" />
              </div>
              <div>
                <h6 className="mb-0">Pending</h6>
                <h3 className="mb-0">{stats.pending}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded me-3">
                <FiBriefcase size={24} className="text-danger" />
              </div>
              <div>
                <h6 className="mb-0">Rejected</h6>
                <h3 className="mb-0">{stats.rejected}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Jobs</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-0"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-between">
                    <FiFilter className="me-2" />
                    {statusFilter === "all" ? "All Statuses" : statusFilter}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    <Dropdown.Item onClick={() => setStatusFilter("all")}>All Statuses</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter("approved")}>Approved</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter("pending")}>Pending</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter("rejected")}>Rejected</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button 
                variant="outline-primary" 
                onClick={fetchJobs}
                className="w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <FiRefreshCw size={18} /> Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error/Alerts */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading jobs...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredJobs.length === 0 && (
        <Card className="border-0 shadow-sm text-center py-5">
          <Card.Body>
            <FiBriefcase size={48} className="text-muted mb-3" />
            <h4>No jobs found</h4>
            <p className="text-muted mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "You haven't posted any jobs yet"}
            </p>
            <Button variant="primary" onClick={() => navigate("/post-job")}>
              Post Your First Job
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Jobs List */}
      {!loading && filteredJobs.length > 0 && (
        <Row className="g-4">
          {filteredJobs.map((job) => (
            <Col xs={12} key={job.id}>
              <Card className="border-0 shadow-sm hover-shadow transition-all h-100">
                <Card.Body className="p-4">
                  <div className="d-flex flex-column flex-md-row">
                    {/* Company Logo */}
                    <div className="mb-3 mb-md-0 me-md-4">
                      {job.company_logo ? (
                        <img
                          src={`http://localhost/Jobconnect/backend/uploads/company_logos/${job.company_logo}`}
                          alt={job.company_name}
                          className="rounded"
                          style={{ 
                            width: "100px", 
                            height: "100px", 
                            objectFit: "cover" 
                          }}
                        />
                      ) : (
                        <div
                          className="bg-light text-secondary d-flex align-items-center justify-content-center rounded"
                          style={{ 
                            width: "100px", 
                            height: "100px" 
                          }}
                        >
                          <FiBriefcase size={32} />
                        </div>
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="flex-grow-1">
                      <div className="d-flex flex-column flex-lg-row justify-content-between mb-3">
                        <div>
                          <h4 className="mb-1">
                            <Link 
                              to={`/job-details/${job.id}`} 
                              className="text-decoration-none text-dark"
                            >
                              {job.title}
                            </Link>
                          </h4>
                          <p className="text-muted mb-2">{job.company_name}</p>
                        </div>
                        <div className="mb-3 mb-lg-0">
                          {getStatusBadge(job.status)}
                        </div>
                      </div>

                      <Row className="mb-3">
                        <Col md={4} className="mb-2">
                          <div className="d-flex align-items-center text-muted">
                            <FiMapPin className="me-2" />
                            <span>{job.location || "Not specified"}</span>
                          </div>
                        </Col>
                        <Col md={4} className="mb-2">
                          <div className="d-flex align-items-center text-muted">
                            <FiBriefcase className="me-2" />
                            <span>{job.job_type}</span>
                          </div>
                        </Col>
                        <Col md={4} className="mb-2">
                          <div className="d-flex align-items-center text-muted">
                            <FiDollarSign className="me-2" />
                            <span>{formatSalary(job.salary)}</span>
                          </div>
                        </Col>
                        <Col md={4} className="mb-2">
                          <div className="d-flex align-items-center text-muted">
                            <FiCalendar className="me-2" />
                            <span>Deadline: {formatDate(job.deadline)}</span>
                          </div>
                        </Col>
                      </Row>

                      <div className="mb-3">
                        <p className="mb-1">
                          <strong>Description:</strong>
                        </p>
                        <p className="text-muted">
                          {job.description.length > 200 
                            ? `${job.description.substring(0, 200)}...` 
                            : job.description}
                        </p>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Posted: {formatDate(job.created_at)}
                        </small>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => navigate(`/edit-job/${job.id}`)}
                            className="d-flex align-items-center gap-1"
                          >
                            <FiEdit2 size={16} /> Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmDelete(job)}
                            className="d-flex align-items-center gap-1"
                          >
                            <FiTrash2 size={16} /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the job "{jobToDelete?.title}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteJob}>
            Delete Job
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Styles */}
      <style>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </Container>
  );
};

export default CompanyDashboard;