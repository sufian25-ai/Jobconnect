import React, { useEffect, useState } from "react";
import api from "../services/api";
import ApplyForm from "./ApplyForm"; // ✅ import

import { Card, Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplyFor, setShowApplyFor] = useState(null); // ✅

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/list.php");
        console.log("API রেসপন্স:", res.data);

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
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Available Jobs</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {jobs.map((job) => (
          <Col md={6} lg={4} className="mb-4" key={job.id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>{job.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{job.location}</Card.Subtitle>
                <Card.Text>
                  {job.description?.substring(0, 100)}...
                </Card.Text>
                <p><strong>Type:</strong> {job.job_type}</p>
                {job.salary && <p><strong>Salary:</strong> ৳{job.salary}</p>}
                {job.deadline && <p><strong>Deadline:</strong> {job.deadline}</p>}

                <Button
                  variant="primary"
                  onClick={() => setShowApplyFor(showApplyFor === job.id ? null : job.id)}
                >
                  {showApplyFor === job.id ? "Close Form" : "Apply Now"}
                </Button>

                {/* ✅ Apply Form show only for current job */}
                {showApplyFor === job.id && (
                  <div className="mt-3">
                    <ApplyForm jobId={job.id} />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Jobs;
