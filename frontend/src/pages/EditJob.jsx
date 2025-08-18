import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner, Row, Col, Card } from "react-bootstrap";
import api from "../services/api";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "Full-time",
    salary: "",
    deadline: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", variant: "" });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs/get_job.php?id=${id}`);
      if (res.data.job) {
        setJob(res.data.job);
      } else {
        setMessage({ text: "Job not found", variant: "danger" });
      }
    } catch (err) {
      setMessage({ 
        text: "Failed to fetch job data", 
        variant: "danger",
        details: err.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!job.title.trim()) newErrors.title = "Job title is required";
    if (!job.description.trim()) newErrors.description = "Description is required";
    if (!job.location.trim()) newErrors.location = "Location is required";
    if (!job.deadline) newErrors.deadline = "Deadline is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setMessage({ text: "Updating job...", variant: "info" });
      
      const res = await api.post("/jobs/edit.php", job);
      
      if (res.data.success) {
        setMessage({ 
          text: "Job updated successfully! Redirecting...", 
          variant: "success" 
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage({ 
          text: res.data.message || "Update failed", 
          variant: "danger" 
        });
      }
    } catch (err) {
      setMessage({ 
        text: "Update failed", 
        variant: "danger",
        details: err.message 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Edit Job Posting</h2>
              
              {message.text && (
                <Alert variant={message.variant} className="mb-4">
                  {message.text}
                  {message.details && (
                    <div className="mt-2">
                      <small className="text-muted">{message.details}</small>
                    </div>
                  )}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Job Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={job.title}
                        onChange={handleChange}
                        isInvalid={!!errors.title}
                        placeholder="e.g. Senior Web Developer"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.title}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Job Type *</Form.Label>
                      <Form.Select
                        name="job_type"
                        value={job.job_type}
                        onChange={handleChange}
                        isInvalid={!!errors.job_type}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                        <option value="Contract">Contract</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={job.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                    placeholder="Detailed job description, requirements, and responsibilities"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location *</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={job.location}
                        onChange={handleChange}
                        isInvalid={!!errors.location}
                        placeholder="e.g. Dhaka, Bangladesh or Remote"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.location}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Salary (BDT)</Form.Label>
                      <Form.Control
                        type="number"
                        name="salary"
                        value={job.salary || ""}
                        onChange={handleChange}
                        placeholder="Monthly salary in BDT"
                      />
                      <Form.Text className="text-muted">
                        Example: 50000
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Deadline *</Form.Label>
                      <Form.Control
                        type="date"
                        name="deadline"
                        value={job.deadline}
                        onChange={handleChange}
                        isInvalid={!!errors.deadline}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.deadline}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={job.status}
                        onChange={handleChange}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="closed">Closed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/dashboard")}
                    className="me-md-2"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Updating...
                      </>
                    ) : (
                      "Update Job"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditJob;