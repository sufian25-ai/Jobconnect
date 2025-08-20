import React, { useEffect, useState } from "react";
import { Nav, Button, Row, Col, Card, Badge, Spinner, Alert } from "react-bootstrap";
import { 
  FaTachometerAlt, FaUsers, FaBuilding, FaBriefcase, 
  FaChartBar, FaSignOutAlt, FaMoneyBillWave, FaFileAlt, FaEnvelope, FaClock
} from "react-icons/fa";
import api from "../services/api";

import UserManagement from "../pages/UserManagement";
import AdminCompanies from "../pages/AdminCompanies";
import AdminJobs from "../pages/AdminJobs";
import AdminApplications from "../pages/AdminApplications";
import AdminCommissions from "../pages/AdminCommissionList";
import AdminIncomeReport from "./AdminIncomeReport";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({});
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, activitiesRes, applicationsRes] = await Promise.all([
        api.get("/dashboard/dashboard-stats.php", { withCredentials: true }),
        api.get("/dashboard/recent-activities.php", { withCredentials: true }),
        api.get("/dashboard/recent-applications.php", { withCredentials: true }),
      ]);

      if (statsRes.data.success) setDashboardStats(statsRes.data.stats || {});
      if (activitiesRes.data.success) setRecentJobs(activitiesRes.data.activities || []);
      if (applicationsRes.data.success) setRecentApplications(applicationsRes.data.applications || []);

    } catch (err) {
      console.error(err);
      setError("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Render Dashboard Stats & Recent Activities
  const renderDashboard = () => {
    const stats = [
      { icon: <FaUsers size={30} />, label: "Users", value: dashboardStats.users || 0 },
      { icon: <FaBuilding size={30} />, label: "Companies", value: dashboardStats.companies || 0 },
      { icon: <FaBriefcase size={30} />, label: "Jobs", value: dashboardStats.jobs || 0 },
      { icon: <FaFileAlt size={30} />, label: "Applications", value: dashboardStats.applications || 0 },
      { icon: <FaMoneyBillWave size={30} />, label: "Commissions", value: `$${dashboardStats.commissions || 0}` },
      { icon: <FaClock size={30} />, label: "Pending Jobs", value: dashboardStats.pendingJobs || 0 },
      { icon: <FaEnvelope size={30} />, label: "Messages", value: dashboardStats.messages || 0 },
      { icon: <FaChartBar size={30} />, label: "Monthly Revenue", value: `$${dashboardStats.monthlyRevenue || 0}` },
    ];

    const jobsList = Array.isArray(recentJobs) ? recentJobs : [];
    const applicationsList = Array.isArray(recentApplications) ? recentApplications : [];

    return (
      <div className="dashboard-content">
        <h2 className="mb-4">Admin Dashboard Overview</h2>

        {/* Stats Cards */}
        <Row className="mb-4">
          {stats.map((s, i) => (
            <Col md={3} key={i}>
              <Card className="stat-card text-center p-3 mb-3">
                {s.icon}
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Recent Jobs & Applications */}
        <Row>
          <Col lg={6}>
            <Card className="mb-4">
              <Card.Header><h5>Recent Jobs</h5></Card.Header>
              <Card.Body className="p-0">
                {jobsList.length > 0 ? (
                  jobsList.map((job, i) => (
                    <div key={i} className="d-flex p-3 border-bottom">
                      <FaBriefcase size={20} className="me-3" />
                      <div>
                        <p className="mb-0"><strong>{job.title}</strong></p>
                        <small className="text-muted">{job.company}</small><br/>
                        <small className="text-muted">Created: {new Date(job.created_at).toLocaleString()}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center p-3">No recent jobs</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="mb-4">
              <Card.Header><h5>Recent Applications</h5></Card.Header>
              <Card.Body className="p-0">
                {applicationsList.length > 0 ? (
                  applicationsList.map((app, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center p-3 border-bottom">
                      <div>
                        <h6 className="mb-0">{app.name}</h6>
                        <small className="text-muted">{app.job} · {app.company}</small><br/>
                        <small className="text-muted">Applied: {app.date}</small>
                      </div>
                      <Badge bg={
                        app.status === 'hired' ? 'success' :
                        app.status === 'shortlisted' ? 'info' :
                        app.status === 'reviewed' ? 'warning' : 'secondary'
                      }>
                        {app.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center p-3">No applications</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    if (loading) return <div className="text-center py-5"><Spinner animation="border" /><p>Loading dashboard...</p></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    switch (activeTab) {
      case "users": return <UserManagement />;
      case "companies": return <AdminCompanies />;
      case "jobs": return <AdminJobs />;
      case "job_application": return <AdminApplications />;
      case "commissions": return <AdminCommissions />;
      case "reports": return <AdminIncomeReport />;
      case "dashboard":
      default: return renderDashboard();
    }
  };

  // Sidebar navigation
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt className="me-2" /> },
    { id: "users", label: "User Management", icon: <FaUsers className="me-2" /> },
    { id: "companies", label: "Company Management", icon: <FaBuilding className="me-2" /> },
    { id: "jobs", label: "Job Management", icon: <FaBriefcase className="me-2" /> },
    { id: "job_application", label: "Applications", icon: <FaFileAlt className="me-2" /> },
    { id: "commissions", label: "Commissions", icon: <FaMoneyBillWave className="me-2" /> },
    { id: "reports", label: "Reports", icon: <FaChartBar className="me-2" /> },
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`bg-dark text-white p-3 ${collapsed ? '' : 'me-3'}`} style={{ minWidth: collapsed ? '60px' : '250px' }}>
        {!collapsed && <h4>Admin Panel</h4>}
        <Button variant="link" className="text-white p-0 mb-3" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '»' : '«'}
        </Button>
        <Nav className="flex-column">
          {navItems.map(i => (
            <Nav.Link key={i.id} className={`text-white ${activeTab === i.id ? 'active' : ''}`} onClick={() => setActiveTab(i.id)}>
              <div className="d-flex align-items-center">{i.icon}{!collapsed && i.label}</div>
            </Nav.Link>
          ))}
          <Nav.Link className="text-white mt-3" onClick={() => console.log("Logout")}>
            <div className="d-flex align-items-center"><FaSignOutAlt className="me-2" /> {!collapsed && "Logout"}</div>
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
