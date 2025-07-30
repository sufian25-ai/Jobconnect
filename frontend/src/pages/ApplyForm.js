import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import services from "../services/api";

const ApplyForm = ({ jobId }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", msg: "" });

    try {
      const res = await services.post("/applications/apply.php", {
        job_id: jobId,
        message,
      });

      if (res.data.success) {
        setFeedback({ type: "success", msg: res.data.message });
        setMessage("");
      } else {
        setFeedback({ type: "danger", msg: res.data.message });
      }
    } catch (err) {
      setFeedback({ type: "danger", msg: "Failed to apply." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3">
      {feedback.msg && <Alert variant={feedback.type}>{feedback.msg}</Alert>}
      <Form.Group>
        <Form.Label>Message (Optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Why you're a good fit?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-2" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Submit Application"}
      </Button>
    </Form>
  );
};

export default ApplyForm;
