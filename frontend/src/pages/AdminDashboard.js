import React, { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBuilding, 
  FaBriefcase, 
  FaCog, 
  FaChartBar,
  FaSignOutAlt 
} from "react-icons/fa";
import UserManagement from "../pages/UserManagement";
import AdminCompanies from "../pages/AdminCompanies";
import AdminJobs from "../pages/AdminJobs";
import AdminApplications from "../pages/AdminApplications";
import AdminCommissions from "../pages/AdminCommissionList";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "companies":
        return <AdminCompanies />;
      case "jobs":
        return <AdminJobs />;
      case "job_application":
        return <AdminApplications />;
      case "commissions":
        return <AdminCommissions />;
      case "dashboard":
      default:
        return (
          <div className="dashboard-welcome">
            <h2 className="mb-4">Welcome to Admin Dashboard</h2>
            <div className="dashboard-stats">
              {/* Add your dashboard stats/components here */}
            </div>
          </div>
        );
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt className="me-2" /> },
    { id: "users", label: "User Management", icon: <FaUsers className="me-2" /> },
    { id: "companies", label: "Company Management", icon: <FaBuilding className="me-2" /> },
    { id: "jobs", label: "Job Management", icon: <FaBriefcase className="me-2" /> },
    { id: "job_application", label: "User Job Application Management", icon: <FaBriefcase className="me-2" /> },
    { id: "commissions", label: "Commission", icon: <FaChartBar className="me-2" /> },
    { id: "settings", label: "Reports", icon: <FaCog className="me-2" /> },
    { id: "reports", label: "Others", icon: <FaChartBar className="me-2" /> },
  ];

  return (
    <div className="admin-dashboard d-flex">
      {/* Sidebar */}
      <div 
        className={`sidebar bg-dark text-white ${collapsed ? 'collapsed' : ''}`}
        style={{ minHeight: "100vh" }}
      >
        <div className="sidebar-header d-flex justify-content-between align-items-center p-3">
          {!collapsed && <h4 className="m-0">Admin Panel</h4>}
          <Button 
            variant="link" 
            className="text-white p-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '»' : '«'}
          </Button>
        </div>
        
        <Nav className="flex-column">
          {navItems.map((item) => (
            <Nav.Link
              key={item.id}
              className={`text-white py-3 ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="d-flex align-items-center">
                {item.icon}
                {!collapsed && item.label}
              </div>
            </Nav.Link>
          ))}
          
          <Nav.Link 
            className="text-white py-3"
            onClick={() => console.log("Logout")} // Add your logout logic
          >
            <div className="d-flex align-items-center">
              <FaSignOutAlt className="me-2" />
              {!collapsed && "Logout"}
            </div>
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-4">
        <div className="content-container">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Add this CSS to your stylesheet
const styles = `
  .admin-dashboard {
    --sidebar-width: 250px;
    --sidebar-collapsed-width: 60px;
    --transition-speed: 0.3s;
  }
  
  .sidebar {
    width: var(--sidebar-width);
    transition: width var(--transition-speed);
  }
  
  .sidebar.collapsed {
    width: var(--sidebar-collapsed-width);
  }
  
  .sidebar .nav-link {
    border-radius: 4px;
    margin: 2px 8px;
    transition: all 0.2s;
  }
  
  .sidebar .nav-link:hover {
    background: rgba(255,255,255,0.1);
  }
  
  .sidebar .nav-link.active {
    background: rgba(255,255,255,0.2);
    font-weight: 500;
  }
  
  .main-content {
    background: #f5f7fa;
    min-height: 100vh;
  }
  
  .content-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    padding: 20px;
    min-height: calc(100vh - 40px);
  }
  
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      z-index: 1000;
      height: 100vh;
    }
    
    .sidebar.collapsed {
      transform: translateX(-100%);
    }
  }
`;

// Add the styles to the head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default AdminDashboard;