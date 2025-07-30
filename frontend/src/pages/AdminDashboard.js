import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

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
    console.log("Admin from localStorage:", admin);
    if (!admin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const adminRaw = localStorage.getItem("admin");
  const admin = safeParseJSON(adminRaw);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h2 className="text-center mb-4">Welcome, {admin?.name || "Admin"}</h2>

        <Row className="g-3">
          <Col md={4}>
            <Card className="text-center p-3 shadow-sm">
              <h5>Manage Jobs</h5>
              <p>Approve or Delete new job posts</p>
              <Button variant="primary" onClick={() => navigate("/admin/jobs")}>
                View Jobs
              </Button>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center p-3 shadow-sm">
              <h5>Users</h5>
              <p>View or manage user accounts</p>
              <Button variant="secondary" disabled>
                Coming Soon
              </Button>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center p-3 shadow-sm">
              <h5>Logout</h5>
              <p>Sign out of the admin panel</p>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </Card>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
