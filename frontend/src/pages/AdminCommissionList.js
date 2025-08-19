import React, { useEffect, useState } from "react";
import { Table, Card, Spinner, Alert, Button } from "react-bootstrap";
import api from "../services/api";

const AdminCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load commissions
  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/commissions/list.php", { withCredentials: true });
      if (res.data.success) {
        setCommissions(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch commissions");
      }
    } catch (err) {
      setError("Error fetching commissions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update commission status
  const markPaid = async (id) => {
    try {
      const res = await api.post(
        "/commissions/update.php",
        { id, status: "paid" },
        { withCredentials: true }
      );
      if (res.data.success) {
        setMessage("Commission marked as paid!");
        fetchCommissions();
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Error updating commission");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p>Loading commissions...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card className="p-3">
      <h3 className="mb-3">All Commissions</h3>
      {message && <Alert variant="success">{message}</Alert>}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Company</th>
              <th>User</th>
              <th>Job</th>
              <th>Total Salary</th>
              <th>Admin Commission</th>
              <th>Status</th>
              <th>Action</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {commissions.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No commissions found
                </td>
              </tr>
            ) : (
              commissions.map((c, index) => (
                <tr key={c.id}>
                  <td>{index + 1}</td>
                  <td>{c.company_name}</td>
                  <td>{c.user_name}</td>
                  <td>{c.job_title}</td>
                  <td>{c.total_salary}</td>
                  <td>{c.admin_commission}</td>
                  <td>
                    {c.status === "pending" ? (
                      <span className="badge bg-warning text-dark">Pending</span>
                    ) : (
                      <span className="badge bg-success">Paid</span>
                    )}
                  </td>
                  <td>
                    {c.status === "pending" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => markPaid(c.id)}
                      >
                        Mark Paid
                      </Button>
                    )}
                  </td>
                  <td>{new Date(c.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default AdminCommissions;
