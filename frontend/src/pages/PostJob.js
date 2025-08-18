import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Row, Col, Card } from "react-bootstrap";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "Full-time",
    salary: "",
    deadline: "",
  });

  const [message, setMessage] = useState({ text: "", variant: "" });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/company/get.php");
        if (res.data.success) {
          setCompany(res.data.company);
        } else {
          console.error(res.data.message);
          setMessage({
            text: "Failed to load company information",
            variant: "danger",
          });
        }
      } catch (err) {
        console.error("Error loading company", err);
        setMessage({
          text: "Error loading company information",
          variant: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, []);

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
      setMessage({ text: "Posting job...", variant: "info" });
      
      const res = await api.post("/jobs/post.php", {
        ...job,
        company_id: company?.id,
        company_name: company?.name,
        company_logo: company?.logo,
      });

      if (res.data.success) {
        setMessage({
          text: "Job posted successfully! Redirecting...",
          variant: "success",
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage({
          text: res.data.message || "Failed to post job",
          variant: "danger",
        });
      }
    } catch (err) {
      setMessage({
        text: "Error occurred while posting job",
        variant: "danger",
      });
      console.error("Job posting error:", err);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Post a New Job</h2>
              
              {message.text && (
                <Alert variant={message.variant} className="mb-4">
                  {message.text}
                </Alert>
              )}

              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading company information...</p>
                </div>
              ) : company ? (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Job Title *</Form.Label>
                        <Form.Control
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
                      name="description"
                      rows={5}
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
                        <Form.Label>Salary (optional)</Form.Label>
                        <Form.Control
                          name="salary"
                          type="number"
                          value={job.salary}
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
                        <Form.Label>Application Deadline *</Form.Label>
                        <Form.Control
                          name="deadline"
                          type="date"
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
                  </Row>

                  <Card className="mb-4 bg-light">
                    <Card.Body>
                      <h5 className="mb-3">Company Information</h5>
                      <div className="d-flex align-items-center">
                        {company.logo && (
                          <img
                            src={company.logo}
                            alt="Company Logo"
                            className="rounded me-3"
                            style={{ width: "60px", height: "60px", objectFit: "contain" }}
                          />
                        )}
                        <div>
                          <h6 className="mb-0">{company.name}</h6>
                          <small className="text-muted">
                            This job will be posted under your company profile
                          </small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate("/dashboard")}
                      className="me-md-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Posting..." : "Post Job"}
                    </Button>
                  </div>
                </Form>
              ) : (
                <Alert variant="danger">
                  Unable to load company information. Please try again later or 
                  <Alert.Link href="/company/create"> create a company profile</Alert.Link>.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostJob;