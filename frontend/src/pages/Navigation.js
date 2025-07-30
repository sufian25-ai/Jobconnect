import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          JobConnect
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/Jobs">Jobs</Nav.Link>
            </Nav>
           
           <Nav className="ml-auto">
            {user?.role === "user" && (
              <Nav.Link as={Link} to="/Profile">My Profile</Nav.Link>
            )}

            {user?.role === "company" && (
              <Nav.Link as={Link} to="/dashboard">Company Dashboard</Nav.Link>
            )}

            
          </Nav>

          <Nav className="ms-auto align-items-center">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <>
                <span className="me-2 text-secondary">Hi, {user.name}</span>
                <Button variant="outline-danger" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
           
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
