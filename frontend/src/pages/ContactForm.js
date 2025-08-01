import React, { useState } from 'react';
import {
  Form,
  Button,
  Alert,
  Spinner,
  FloatingLabel,
  Row,
  Col,
  Container
} from 'react-bootstrap';
import api from '../services/api';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^(?:\+88|01)?\d{11}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid Bangladeshi phone number.';
    }

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message should be at least 20 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await api.post('/contact/contact.php', formData);
      if (res.data.success) {
        setSubmitStatus({
          success: true,
          message: '✅ Your message has been sent successfully!'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus({
          success: false,
          message: res.data.message || '❌ Failed to send message. Try again.'
        });
      }
    } catch (err) {
      setSubmitStatus({
        success: false,
        message: '❌ Server error. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     <div className="about-page">
      <div className="about-hero text-white text-center py-5">
        <h1 className="display-4">Contact Us</h1>
        <p className="lead">Connecting Talent with Opportunity</p>
      </div>
    <section className="contact-form-section py-5">
      <Container>
        <div className="text-center mb-4">
          <h2 className="contact-title">Get in Touch</h2>
          <p className="text-muted">Have a question or want to collaborate? We'd love to hear from you!</p>
        </div>

        {submitStatus && (
          <Alert variant={submitStatus.success ? 'success' : 'danger'}>
            {submitStatus.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate className="shadow-lg p-4 bg-white rounded contact-form">
          <Row className="g-3">
            <Col md={6}>
              <FloatingLabel controlId="name" label="Full Name">
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  placeholder="Your Name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>

            <Col md={6}>
              <FloatingLabel controlId="email" label="Email Address">
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="name@example.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>

            <Col md={6}>
              <FloatingLabel controlId="phone" label="Phone Number">
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                  placeholder="01XXXXXXXXX"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>

            <Col md={6}>
              <FloatingLabel controlId="subject" label="Subject">
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  isInvalid={!!errors.subject}
                  placeholder="Subject"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.subject}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>

            <Col md={12}>
              <FloatingLabel controlId="message" label="Your Message">
                <Form.Control
                  as="textarea"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  isInvalid={!!errors.message}
                  style={{ height: '160px' }}
                  placeholder="Type your message here..."
                />
                <Form.Control.Feedback type="invalid">
                  {errors.message}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>

            <Col className="text-center mt-3">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="px-4 py-2"
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" />
                    <span className="ms-2">Sending...</span>
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
    </div>
  );
};

export default ContactForm;
