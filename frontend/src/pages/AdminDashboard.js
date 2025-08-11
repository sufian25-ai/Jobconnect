import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Badge,
  Nav,
  Offcanvas
} from "react-bootstrap";
import { 
  FaBriefcase, 
  FaUsers, 
  FaClipboardCheck, 
  FaClock, 
  FaCogs,
  FaHome,
  FaBars,
  FaSignOutAlt,
  FaUserCog,
  FaChartLine,
  FaEnvelope
} from "react-icons/fa";

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
  const [showSidebar, setShowSidebar] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    totalUsers: 0,
    totalApplications: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminRaw = localStorage.getItem("admin");
    const admin = safeParseJSON(adminRaw);
    if (!admin) {
      navigate("/admin/dashboard");
      return;
    }

    // Fetch dashboard data from backend
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/admin/dashboard');
        // const data = await response.json();
        
        // Mock data - replace with actual API call
        const mockData = {
          totalJobs: 128,
          totalUsers: 356,
          totalApplications: 912,
          recentActivities: [
            {
              id: 1,
              action: 'Approved job post "React Developer"',
              user: 'john_doe',
              time: '2 hours ago',
              status: 'success'
            },
            {
              id: 2,
              action: 'Deleted spam job "Free Crypto Job"',
              user: 'admin',
              time: '4 hours ago',
              status: 'danger'
            },
            {
              id: 3,
              action: 'Updated user profile info',
              user: 'emma_watson',
              time: '1 day ago',
              status: 'info'
            }
          ]
        };
        
        setDashboardData(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const adminRaw = localStorage.getItem("admin");
  const admin = safeParseJSON(adminRaw);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  // if (loading) {
  //   return (
  //     <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
  //       <div className="text-center">
  //         <div className="spinner-border text-primary" role="status">
  //           <span className="visually-hidden">Loading...</span>
  //         </div>
  //         <p className="mt-2">Loading dashboard...</p>
  //       </div>
  //     </Container>
  //   );
  // }

  return (
    <div className="d-flex">
      {/* Sidebar - Desktop */}
      <div className="d-none d-md-block bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3 border-bottom">
          <h4 className="mb-0">Admin Panel</h4>
        </div>
        <Nav className="flex-column p-3">
          <Nav.Link className="text-white active mb-2" onClick={() => navigate("/admin/dashboard")}>
            <FaHome className="me-2" /> Dashboard
          </Nav.Link>
          <Nav.Link className="text-white mb-2" onClick={() => navigate("/admin/jobs")}>
            <FaBriefcase className="me-2" /> Job Management
          </Nav.Link>
          <Nav.Link className="text-white mb-2" disabled>
            <FaUsers className="me-2" /> User Management
          </Nav.Link>
          <Nav.Link className="text-white mb-2" disabled>
            <FaEnvelope className="me-2" /> Messages
          </Nav.Link>
          <Nav.Link className="text-white mb-2" disabled>
            <FaChartLine className="me-2" /> Analytics
          </Nav.Link>
          <Nav.Link className="text-white mb-2" disabled>
            <FaUserCog className="me-2" /> Admin Settings
          </Nav.Link>
          <Nav.Link className="text-white mt-4" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Top Navbar - Mobile */}
        <nav className="d-md-none navbar navbar-dark bg-dark">
          <Container fluid>
            <Button variant="dark" onClick={() => setShowSidebar(true)}>
              <FaBars />
            </Button>
            <span className="navbar-brand">Admin Panel</span>
          </Container>
        </nav>

        {/* Sidebar - Mobile */}
        <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Admin Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link className="mb-2" onClick={() => { navigate("/admin/dashboard"); setShowSidebar(false); }}>
                <FaHome className="me-2" /> Dashboard
              </Nav.Link>
              <Nav.Link className="mb-2" onClick={() => { navigate("/admin/jobs"); setShowSidebar(false); }}>
                <FaBriefcase className="me-2" /> Job Management
              </Nav.Link>
              <Nav.Link className="mb-2" disabled>
                <FaUsers className="me-2" /> User Management
              </Nav.Link>
              <Nav.Link className="mb-2" disabled>
                <FaEnvelope className="me-2" /> Messages
              </Nav.Link>
              <Nav.Link className="mb-2" disabled>
                <FaChartLine className="me-2" /> Analytics
              </Nav.Link>
              <Nav.Link className="mb-2" disabled>
                <FaUserCog className="me-2" /> Admin Settings
              </Nav.Link>
              <Nav.Link className="mt-4" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Dashboard Content */}
        <Container className="mt-4">
          <h2 className="mb-4">Welcome, {admin?.name || "Admin"}</h2>

          {/* Top Stats */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center shadow-sm p-3">
                <FaBriefcase size={40} className="mb-2 text-primary" />
                <h5>Total Jobs</h5>
                <h3>{dashboardData.totalJobs}</h3>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm p-3">
                <FaUsers size={40} className="mb-2 text-success" />
                <h5>Total Users</h5>
                <h3>{dashboardData.totalUsers}</h3>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm p-3">
                <FaClipboardCheck size={40} className="mb-2 text-warning" />
                <h5>Total Applications</h5>
                <h3>{dashboardData.totalApplications}</h3>
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
                {dashboardData.recentActivities.map(activity => (
                  <tr key={activity.id}>
                    <td>{activity.id}</td>
                    <td>{activity.action}</td>
                    <td>{activity.user}</td>
                    <td>{activity.time}</td>
                    <td><Badge bg={activity.status}>{activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;