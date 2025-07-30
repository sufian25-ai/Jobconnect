import React, { useState } from "react";
import api from "../services/api";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    try {
      const res = await api.post("/auth/register.php", form);
      if (res.data.success) {
        setMessage("✅ Registration successful!");
      } else {
        setMessage(`❌ ${res.data.error}`);
      }
    } catch (err) {
      setMessage("❌ Something went wrong.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="p-4 shadow w-100" style={{ maxWidth: "600px" }}>
        <h2 className="text-center text-primary mb-4">Create an Account</h2>

        {message && (
          <Alert variant={message.includes("✅") ? "success" : "danger"} className="text-center">
            {message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formRole" className="mb-3">
            <Form.Label>Select Role</Form.Label>
            <Form.Control as="select" name="role" value={form.role} onChange={handleChange}>
              <option value="user">Job Seeker</option>
              <option value="company">Company</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Register
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
