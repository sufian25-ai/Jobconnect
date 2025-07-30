import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CompanyDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "company") {
      navigate("/login");
    } else {
      fetchJobs();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get(`/jobs/company_jobs.php?company_id=${user.id}`);
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs");
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure to delete this job?")) return;

    try {
      const res = await api.post("/jobs/delete.php", { id: jobId });
      if (res.data.success) {
        setJobs(jobs.filter((job) => job.id !== jobId));
      }
    } catch (err) {
      console.error("Delete failed");
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Company Dashboard</h2>
        <Button variant="primary" onClick={() => navigate("/post-job")}>
          + Post New Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <p>No job posts yet.</p>
      ) : (
        <Row>
          {jobs.map((job) => (
            <Col md={6} lg={4} className="mb-4" key={job.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {job.location} | {job.type}
                  </Card.Subtitle>
                  <Card.Text>{job.description.slice(0, 100)}...</Card.Text>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteJob(job.id)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CompanyDashboard;
