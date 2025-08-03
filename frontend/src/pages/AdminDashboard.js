import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Table, Badge } from "react-bootstrap";
import { FaBriefcase, FaUsers, FaClipboardCheck, FaClock, FaCogs } from "react-icons/fa";

const safeParseJSON = (item) => {
  try {
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error("Parsing error:", e);
    return null;
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminRaw = localStorage.getItem("admin");
    const admin = safeParseJSON(adminRaw);
    if (!admin) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const adminRaw = localStorage.getItem("admin");
  const admin = safeParseJSON(adminRaw);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Welcome, {admin?.name || "Admin"}</h2>

      {/* Top Stats */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm p-3">
            <FaBriefcase size={40} className="mb-2 text-primary" />
            <h5>Total Jobs</h5>
            <h3>128</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm p-3">
            <FaUsers size={40} className="mb-2 text-success" />
            <h5>Total Users</h5>
            <h3>356</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm p-3">
            <FaClipboardCheck size={40} className="mb-2 text-warning" />
            <h5>Total Applications</h5>
            <h3>912</h3>
          </Card>
        </Col>
      </Row>

      {/* Action Cards */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm p-4 text-center">
            <h5>Manage Jobs</h5>
            <p>Approve or delete posted jobs</p>
            <Button variant="primary" onClick={() => navigate("/admin/jobs")}>
              Go to Job Management
            </Button>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm p-4 text-center">
            <h5>User Management</h5>
            <p>View, edit, or block users</p>
            <Button variant="secondary" disabled>
              Coming Soon
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Card className="shadow-sm p-4 mb-5">
        <h5 className="mb-3"><FaClock className="me-2" />Recent Activities</h5>
        <Table hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Action</th>
              <th>User</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Approved job post "React Developer"</td>
              <td>john_doe</td>
              <td>2 hours ago</td>
              <td><Badge bg="success">Success</Badge></td>
            </tr>
            <tr>
              <td>2</td>
              <td>Deleted spam job "Free Crypto Job"</td>
              <td>admin</td>
              <td>4 hours ago</td>
              <td><Badge bg="danger">Deleted</Badge></td>
            </tr>
            <tr>
              <td>3</td>
              <td>Updated user profile info</td>
              <td>emma_watson</td>
              <td>1 day ago</td>
              <td><Badge bg="info">Updated</Badge></td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
