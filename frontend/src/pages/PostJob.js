import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "Full-time",
    salary: "",
    deadline: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
    
  };
  

  const handleSubmit = async (e) => {
    console.log("Submitting Job:", {
  ...job,
  company_id: user?.id,
});

    e.preventDefault();

    try {
      
      const res = await api.post("/jobs/post.php", {
        ...job,
        company_id: user?.id,
      });

      if (res.data.success) {

        setMessage("Job posted successfully!");
        setTimeout(() => navigate("/Jobs"), 1500);
      } else {
        setMessage("Failed to post job.");
      }
    } catch (err) {
      setMessage("Error occurred while posting.");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Post a New Job</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Job Title</Form.Label>
          <Form.Control name="title" value={job.title} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" rows={4} value={job.description} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control name="location" value={job.location} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Type</Form.Label>
          <Form.Select name="job_type" value={job.job_type} onChange={handleChange}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Remote</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Salary (optional)</Form.Label>
          <Form.Control name="salary" type="number" value={job.salary} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Application Deadline</Form.Label>
          <Form.Control name="deadline" type="date" value={job.deadline} onChange={handleChange} />
        </Form.Group>

        <Button type="submit" variant="primary">Post Job</Button>
      </Form>
    </Container>
  );
};

export default PostJob;
