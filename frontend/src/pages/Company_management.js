import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Container, Card, Row, Col, Spinner, Alert, Image } from "react-bootstrap";

const CompanyManagement = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get("/admin/get_company.php");
        if (res.data.success) {
          setCompany(res.data.company);
        } else {
          setError(res.data.message || "Company not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch company data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="my-5">
      <Card className="shadow-sm">
        {company.banner && (
          <Card.Img
            variant="top"
            src={company.banner}
            style={{ maxHeight: "250px", objectFit: "cover" }}
          />
        )}
        <Card.Body>
          <Row className="mb-4">
            <Col md={3} className="text-center">
              {company.logo ? (
                <Image
                  src={company.logo}
                  roundedCircle
                  fluid
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor: "#ddd",
                    lineHeight: "120px",
                  }}
                >
                  No Logo
                </div>
              )}
            </Col>
            <Col md={9}>
              <h2>{company.name}</h2>
              <p>{company.description}</p>
              {company.website && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a href={company.website} target="_blank" rel="noreferrer">
                    {company.website}
                  </a>
                </p>
              )}
              {company.linkedin && (
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a href={company.linkedin} target="_blank" rel="noreferrer">
                    {company.linkedin}
                  </a>
                </p>
              )}
              <p>
                <strong>Industry:</strong> {company.industry || "N/A"} |{" "}
                <strong>Founded:</strong> {company.founded || "N/A"} |{" "}
                <strong>Employees:</strong> {company.employees || "N/A"}
              </p>
            </Col>
          </Row>

          <Row>
            {company.products && (
              <Col md={6}>
                <h5>Products</h5>
                <p>{company.products}</p>
              </Col>
            )}
            {company.services && (
              <Col md={6}>
                <h5>Services</h5>
                <p>{company.services}</p>
              </Col>
            )}
          </Row>

          {company.achievements && (
            <div className="mt-4">
              <h5>Achievements</h5>
              <p>{company.achievements}</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CompanyManagement;
