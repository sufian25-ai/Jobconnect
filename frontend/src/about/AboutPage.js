import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-hero text-white text-center py-5">
        <h1 className="display-4">About JobConnect</h1>
        <p className="lead">Connecting Talent with Opportunity</p>
      </div>

      <Container className="my-5">
        {/* Mission Section */}
        <Row className="mb-5">
          <Col md={6}>
            <img
              src="http://localhost/Jobconnect/frontend/src/pages/images/mission.png"
              alt="Mission"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6}>
            <h2>Our Mission</h2>
            <p>
              JobConnect is a professional job management platform built to bridge the gap between job seekers and employers. Our goal is to make the recruitment process faster, simpler, and smarter. Whether you are looking for your dream job or the perfect candidate, JobConnect provides powerful tools to help you achieve your goals.
            </p>
          </Col>
        </Row>

        {/* Features Section */}
        <div className="d-flex flex-column align-items-center mb-4">
         <h2 className="mb-4">Key Features</h2>
        <Row className="text-center mb-5">
          {[
            {
              title: 'Smart Job Matching',
              text: 'Our algorithm connects candidates with the most relevant job listings based on skills, experience, and interest.'
            },
            {
              title: 'Resume Upload',
              text: 'Applicants can upload resumes and build professional profiles to showcase their qualifications.'
            },
            {
              title: 'Company Dashboards',
              text: 'Employers get full control to post jobs, manage applicants, and track performance.'
            },
            {
              title: 'Admin Control Panel',
              text: 'Powerful backend to approve jobs, manage users, and monitor activity for smooth operations.'
            }
          ].map((feature, idx) => (
            <Col md={6} lg={3} className="mb-4" key={idx}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{feature.title}</Card.Title>
                  <Card.Text>{feature.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        </div>

        {/* Team Section */}
        <div className="d-flex flex-column align-items-center mb-4">
          <h2 className="text-center mb-4">Meet the Team</h2>
        <Row className="mb-5">
          <Col md={4} className="text-center mb-4">
            <img
              src="http://localhost/Jobconnect/frontend/src/pages/images/profile1.png"
              alt="Founder"
              className="rounded-circle mb-3"
            />
            <h5>Md Mahabub</h5>
            <p>Founder & Full Stack Developer</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <img
              src="http://localhost/Jobconnect/frontend/src/pages/images/profile.png"
              alt="Co-Founder"
              className="rounded-circle mb-3"
            />
            <h5>Rubayet Arefin</h5>
            <p>UI/UX Designer & React Specialist</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <img
              src="http://localhost/Jobconnect/frontend/src/pages/images/profile3.png"
              alt="Backend"
              className="rounded-circle mb-3"
            />
            <h5>Rafiya</h5>
            <p>Laravel Developer</p>
          </Col>
        </Row>
        </div>

        {/* CTA */}
        <Row className="text-center">
          <Col>
            <h4>Want to learn more or collaborate with us?</h4>
            <Button variant="primary" size="lg" href="/register" className="mt-3 ">
              
              Contact Us
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;
