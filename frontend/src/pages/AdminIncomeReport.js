import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../services/api";

const AdminIncomeReport = () => {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get("/admin/admin_income_report.php");
        if (res.data.success) {
          setSummary(res.data.summary);
          setMonthly(res.data.monthly);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError("Error loading report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Admin Income Report</h2>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={2}><Card body className="text-center bg-light">Today <h4>৳{summary.today}</h4></Card></Col>
        <Col md={2}><Card body className="text-center bg-primary text-white">Month <h4>৳{summary.month}</h4></Card></Col>
        <Col md={2}><Card body className="text-center bg-success text-white">Year <h4>৳{summary.year}</h4></Card></Col>
        <Col md={2}><Card body className="text-center bg-dark text-white">Total <h4>৳{summary.total}</h4></Card></Col>
        <Col md={2}><Card body className="text-center bg-success-subtle">Paid <h4>৳{summary.paid}</h4></Card></Col>
        <Col md={2}><Card body className="text-center bg-warning">Pending <h4>৳{summary.pending}</h4></Card></Col>
      </Row>

      {/* Chart */}
      <Card className="p-3">
        <h5>Monthly Income</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#0d6efd" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Container>
  );
};

export default AdminIncomeReport;
