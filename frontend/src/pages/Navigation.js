// import React from "react";
// import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { FaUserCircle } from "react-icons/fa";

// const Navigation = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
//       <Container>
//         <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4">
//           JobConnect
//         </Navbar.Brand>

//         <Navbar.Toggle aria-controls="main-navbar" />
//         <Navbar.Collapse id="main-navbar" className="justify-content-between">
//           {/* Left Nav */}
//           <Nav className="me-auto gap-2">
//             <Nav.Link as={Link} to="/">Home</Nav.Link>
//             <Nav.Link as={Link} to="/Jobs">Jobs</Nav.Link>
//             <Nav.Link as={Link} to="/Contact">Contact</Nav.Link>
//             <Nav.Link as={Link} to="/About">About</Nav.Link>
//           </Nav>

//           {/* Right Nav */}
//           <Nav className="d-flex align-items-center gap-3">
//             {!user ? (
//               <>
//                 <Nav.Link as={Link} to="/login">Login</Nav.Link>
//                 <Nav.Link as={Link} to="/register">
//                   <Button variant="primary" size="sm">Register</Button>
//                 </Nav.Link>
//               </>
//             ) : (
//               <>
//                 <FaUserCircle size={22} className="text-secondary" />
//                 <NavDropdown title={`Hi, ${user.name}`} id="user-nav-dropdown">
//                   {user.role === "user" && (
//                     <NavDropdown.Item as={Link} to="/Profile">My Profile</NavDropdown.Item>
//                   )}
//                   {user.role === "company" && (
//                     <NavDropdown.Item as={Link} to="/dashboard">Company Dashboard</NavDropdown.Item>
//                   )}
//                   <NavDropdown.Divider />
//                   <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
//                 </NavDropdown>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default Navigation;
import React from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  // Safe parsing of localStorage
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Invalid user in localStorage:", err);
    localStorage.removeItem("user");
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4">
          JobConnect
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          {/* Left Nav */}
          <Nav className="me-auto gap-2">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/Jobs">Jobs</Nav.Link>
            <Nav.Link as={Link} to="/Contact">Contact</Nav.Link>
            <Nav.Link as={Link} to="/About">About</Nav.Link>
          </Nav>

          {/* Right Nav */}
          <Nav className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="text-secondary">Welcome, {user.name}</span>
                {user.role === "user" && (
                  <NavDropdown.Item as={Link} to="/Profile">My Profile</NavDropdown.Item>
                )}
                {user.role === "company" && (
                  <NavDropdown.Item as={Link} to="/dashboard">Company Dashboard</NavDropdown.Item>
                )}
                { user.role === "admin" && (
                  <NavDropdown.Item as={Link} to="/admin/dashboard">Admin Dashboard</NavDropdown.Item>
                )}
                

              <Button variant="outline-primary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
