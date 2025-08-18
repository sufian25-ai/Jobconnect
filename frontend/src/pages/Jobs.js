import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaMoneyBillWave,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { BsBuilding, BsCalendarDate } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    jobType: "",
    location: "",
    salary: "",
  });
  const [applyForm, setApplyForm] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
    cover_letter: "",
  });
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800 });
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/list.php");
        if (res.data.success) {
          const jobsWithFullLogoPath = res.data.jobs.map((job) => ({
            ...job,
            company_logo: job.company_logo
              ? `http://localhost/Jobconnect/backend/uploads/company_logos/${job.company_logo}`
              : "/images/default-company.png",
            company_name: job.company_name || "Confidential Company",
          }));
          setJobs(jobsWithFullLogoPath || []);
          setFilteredJobs(jobsWithFullLogoPath || []);
        } else {
          setError(res.data.message || "No jobs found");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let results = jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.company_name &&
          job.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (filters.jobType) {
      results = results.filter((job) => job.job_type === filters.jobType);
    }

    if (filters.location) {
      results = results.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.salary) {
      results = results.filter((job) => {
        const jobSalary = job.salary
          ? parseInt(job.salary.toString().replace(/,/g, ""))
          : 0;
        return jobSalary >= parseInt(filters.salary);
      });
    }

    setFilteredJobs(results);
  }, [searchTerm, filters, jobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      jobType: "",
      location: "",
      salary: "",
    });
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
    // Pre-fill form with user data if available
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setApplyForm({
        ...applyForm,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  };

  const handleApplyFormChange = (e) => {
    const { name, value } = e.target;
    setApplyForm({
      ...applyForm,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setApplyForm({
      ...applyForm,
      resume: e.target.files[0],
    });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyLoading(true);
    setApplyError("");
    setApplySuccess("");

    try {
      const formData = new FormData();
      formData.append("job_id", selectedJob.id);
      formData.append("name", applyForm.name);
      formData.append("email", applyForm.email);
      formData.append("phone", applyForm.phone);
      formData.append("cover_letter", applyForm.cover_letter);
      if (applyForm.resume) {
        formData.append("resume", applyForm.resume);
      }

      const res = await api.post("/applications/apply.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        setApplySuccess(res.data.message);
        setTimeout(() => {
          setShowApplyModal(false);
          setApplyForm({
            name: "",
            email: "",
            phone: "",
            resume: null,
            cover_letter: "",
          });
        }, 1500);
      } else {
        setApplyError(res.data.message || "Failed to submit application");
      }
    } catch (err) {
      console.error("Application error:", err);
      setApplyError("Error submitting application. Please try again.");
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="jobs-page">
      {/* Hero Section */}
      <div className="jobs-hero text-white text-center py-5 position-relative">
        <div className="overlay"></div>
        <Container className="position-relative z-index-1">
          <h1 className="display-4 fw-bold mb-3">Find Your Dream Job</h1>
          <p className="lead mb-4">Browse opportunities from top companies</p>

          {/* Search Bar */}
          <div className="job-search-bar mx-auto" style={{ maxWidth: "800px" }}>
            <InputGroup className="mb-3 shadow-lg">
              <InputGroup.Text className="bg-white border-end-0">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by job title, company, or keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0"
              />
              <Button variant="primary">
                <FaSearch className="me-2" />
                Search
              </Button>
            </InputGroup>
          </div>
        </Container>
      </div>

      <Container className="my-5">
        {/* Filter Section */}
        <div className="filter-section mb-5 p-4 bg-light rounded-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">
              <FaFilter className="me-2" />
              Filter Jobs
            </h5>
            <Button variant="link" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Job Type</Form.Label>
                <Form.Select
                  name="jobType"
                  value={filters.jobType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City or Country"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Minimum Salary (৳)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Minimum salary"
                  name="salary"
                  value={filters.salary}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Results Count */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
          </h4>
          <div className="text-muted">
            Sorted by: <strong>Newest First</strong>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Loading job listings...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-5">
            <h4 className="mb-3">No jobs match your criteria</h4>
            <p className="text-muted mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button variant="primary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}

        <Row className="g-4">
          {filteredJobs.map((job) => (
            <Col md={6} lg={4} key={job.id} data-aos="fade-up">
              <Card className="h-100 job-card shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  {/* Company Logo & Badges */}
                  <div className="d-flex align-items-start mb-3">
                    <div className="company-logo me-3">
                      <img
                        src={job.company_logo}
                        alt={job.company_name}
                        className="img-fluid rounded"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/images/default-company.png";
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <Badge bg="light" text="dark" className="text-uppercase">
                          {job.job_type || "Full-time"}
                        </Badge>
                        {job.status === "approved" && (
                          <Badge bg="success">Verified</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Job Title & Company */}
                  <Card.Title className="mb-2">{job.title}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    <BsBuilding className="me-1" /> {job.company_name}
                  </Card.Subtitle>

                  {/* Job Meta */}
                  <ul className="job-meta list-unstyled mb-3">
                    <li>
                      <FaMapMarkerAlt className="me-2" />
                      {job.location}
                    </li>
                    <li>
                      <FaMoneyBillWave className="me-2" />
                      {job.salary
                        ? `৳${job.salary.toLocaleString()}`
                        : "Salary negotiable"}
                    </li>
                    <li>
                      <FaBriefcase className="me-2" />
                      {job.job_type || "Full-time"}
                    </li>
                    <li>
                      <FaClock className="me-2" />
                      Apply before: {new Date(job.deadline).toLocaleDateString()}
                    </li>
                  </ul>

                  {/* Job Description */}
                  <Card.Text className="flex-grow-1 mb-4">
                    {job.description?.length > 150
                      ? `${job.description.substring(0, 150)}...`
                      : job.description}
                  </Card.Text>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 mt-auto">
                    <Button
                      variant="primary"
                      className="flex-grow-1"
                      onClick={() => handleApplyClick(job)}
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="outline-secondary"
                      href={`/job/${job.id}`}
                      className="d-flex align-items-center"
                    >
                      <FiExternalLink className="me-1" />
                      Details
                    </Button>
                  </div>
                </Card.Body>

                {/* Posted Date */}
                <Card.Footer className="text-muted small d-flex justify-content-between">
                  <span>
                    <BsCalendarDate className="me-1" />
                    Posted: {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  <span>Ref: {job.id}</span>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Apply Modal */}
      <Modal
        show={showApplyModal}
        onHide={() => setShowApplyModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Apply for {selectedJob?.title} at {selectedJob?.company_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {applySuccess ? (
            <Alert variant="success" className="text-center">
              {applySuccess}
            </Alert>
          ) : (
            <Form onSubmit={handleApplySubmit}>
              {applyError && (
                <Alert variant="danger" className="mb-3">
                  {applyError}
                </Alert>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={applyForm.name}
                      onChange={handleApplyFormChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={applyForm.email}
                      onChange={handleApplyFormChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={applyForm.phone}
                      onChange={handleApplyFormChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Resume (PDF/DOC) *</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      Max file size: 2MB
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label>Cover Letter (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="cover_letter"
                  value={applyForm.cover_letter}
                  onChange={handleApplyFormChange}
                  placeholder="Tell us why you're a good fit for this position..."
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowApplyModal(false)}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={applyLoading}>
                  {applyLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Jobs;
