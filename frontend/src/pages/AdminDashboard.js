import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import UserManagement from "../pages/UserManagement";
import CompanyManagement from "../pages/Company_management";

const AdminDashboard = () => {
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showCompanyManagement, setShowCompanyManagement] = useState(false);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div style={{ width: "250px", background: "#222", color: "#fff", minHeight: "100vh" }}>
        <h4 className="p-3">Admin Panel</h4>
        <Nav className="flex-column p-3">
          <Nav.Link className="text-white" onClick={() => setShowUserManagement(false)}>
            Dashboard
          </Nav.Link>
          <Nav.Link className="text-white" onClick={() => setShowUserManagement(true)}>
            User Management
          </Nav.Link>
          <Nav.Link className="text-white" onClick={() => setShowCompanyManagement(true)}>
            Company Management
          </Nav.Link>
          {/* <Nav.Link className="text-white" onClick={() => setShowUserManagement(true)}>
            Job Management
          </Nav.Link>
          <Nav.Link className="text-white" onClick={() => setShowUserManagement(true)}>
            Settings  
          </Nav.Link>
          <Nav.Link className="text-white" onClick={() => setShowUserManagement(true)}>
            Reports 
          </Nav.Link>
          <Nav.Link className="text-white" onClick={() => setShowUserManagement(true)}>
            Logout  
          </Nav.Link> */}
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {showUserManagement ? (
          <UserManagement />
        ) : showCompanyManagement ? (
          <CompanyManagement /> 
        ) : (
          <h2>Welcome to the Dashboard</h2>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
