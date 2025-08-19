import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Spinner, Alert } from "react-bootstrap";
import api from "../services/api";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/admin/admin_get_jobs.php", { withCredentials: true });
      if (res.data.success) {
        setJobs(res.data.jobs);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (jobId, status) => {
    try {
      const res = await api.post("/admin/admin_update_job_status.php", {
        job_id: jobId,
        status,
      }, { withCredentials: true });

      if (res.data.success) {
        setJobs(jobs.map(job =>
          job.id === jobId ? { ...job, status } : job
        ));
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error updating job status");
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="p-3">
      <h3>Manage Jobs</h3>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Company</th>
            <th>Title</th>
            <th>Location</th>
            <th>Job Type</th>
            <th>Salary</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>
                {job.logo && (
                  <img
                    src={`http://localhost/jobconnect/backend/uploads/company_logos/${job.logo}`}
                    alt="logo"
                    width="40"
                    className="me-2"
                  />
                )}
                {job.name}
              </td>
              <td>{job.title}</td>
              <td>{job.location}</td>
              <td>{job.job_type}</td>
              <td>{job.salary || "N/A"}</td>
              <td>{job.deadline}</td>
              <td>
                <Badge bg={
                  job.status === "approved" ? "success" :
                  job.status === "rejected" ? "danger" :
                  "warning"
                }>
                  {job.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => updateStatus(job.id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => updateStatus(job.id, "rejected")}
                >
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminJobs;
