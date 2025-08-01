import React, { useEffect, useState } from "react";
import api from "../services/api";
import ApplyForm from "./ApplyForm";

import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaMoneyBillWave } from "react-icons/fa";
import { BsBuilding } from "react-icons/bs";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplyFor, setShowApplyFor] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/list.php");
        if (res.data.success) {
          setJobs(res.data.jobs || []);
        } else {
          setError(res.data.message || "কোন চাকরি পাওয়া যায়নি");
        }
      } catch (err) {
        console.error("এরর:", err);
        setError("চাকরি লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
     <div className="about-page">
      <div className="about-hero text-white text-center py-5">
        <h1 className="display-4">All Job Openings</h1>
        <p className="lead">Connecting Talent with Opportunity</p>
      </div>
    <Container className="my-5">
      <h2 className="text-center mb-4">🔥 Latest Job Openings</h2>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {jobs.map((job) => (
          <Col md={6} lg={4} className="mb-4" key={job.id}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                {/* Title & Company */}
                <Card.Title className="d-flex justify-content-between align-items-start">
                  <span>{job.title}</span>
                  {job.job_type && (
                    <Badge bg="info" className="text-uppercase">
                      {job.job_type}
                    </Badge>
                  )}
                </Card.Title>

                <Card.Subtitle className="mb-2 text-muted">
                  <BsBuilding className="me-1" /> {job.company || "Unknown Company"}
                </Card.Subtitle>

                {/* Meta Info */}
                <div className="mb-2 text-secondary" style={{ fontSize: "0.9rem" }}>
                  <FaMapMarkerAlt className="me-1" /> {job.location} <br />
                  <FaMoneyBillWave className="me-1" /> ৳{job.salary || "Negotiable"} <br />
                  <FaClock className="me-1" /> Deadline: {job.deadline}
                </div>

                {/* Description */}
                <Card.Text>
                  {job.description?.substring(0, 100)}...
                </Card.Text>

                {/* Apply Button */}
                <Button
                  variant={showApplyFor === job.id ? "danger" : "primary"}
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    setShowApplyFor(showApplyFor === job.id ? null : job.id)
                  }
                >
                  {showApplyFor === job.id ? "Close Form" : "Apply Now"}
                </Button>

                {/* Apply Form */}
                {showApplyFor === job.id && (
                  <div className="mt-3">
                    <ApplyForm jobId={job.id} />
                  </div>
                )}
              </Card.Body>

              {/* Footer / Post Date */}
              <Card.Footer className="text-muted text-end small">
                Posted: {job.posted_date || "Recently"}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </div>
  );
};

export default Jobs;
