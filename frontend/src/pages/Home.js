import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel, Card } from 'react-bootstrap';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await api.get('/jobs/list.php');
        if (res.data.success) {
          setFeaturedJobs(res.data.jobs);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section text-white d-flex align-items-center">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="hero-title mb-3">Find Your Dream Job with JobConnect</h1>
              <p className="lead">Connecting top talent with top companies across Bangladesh. 10,000+ jobs await.</p>
              <Button variant="light" size="lg" href="/jobs">Browse Jobs</Button>
            </Col>
            <Col lg={6}>
              <img src="http://localhost/Jobconnect/frontend/src/pages/images/hero-image.png" alt="Job Search" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* FEATURED JOBS */}
      <section className="py-5 job-slider-section">
        <Container>
          <h2 className="text-center mb-4">Featured Jobs</h2>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" />
            </div>
          ) : featuredJobs.length ? (
            <Carousel indicators={false}>
              {featuredJobs.map((job) => (
                <Carousel.Item key={job.id}>
                  <Card className="p-4 shadow-lg">
                    <Row>
                      <Col md={6}>
                        <h3>{job.title}</h3>
                        <p className="text-muted">{job.company}</p>
                        <p><i className="fas fa-map-marker-alt"></i> {job.location}</p>
                        <p><i className="fas fa-money-bill-wave"></i> ৳{job.salary}</p>
                        <Button variant="primary" href={`/job/${job.id}`}>View Details</Button>
                      </Col>
                      <Col md={6}>
                        <p>{job.description?.slice(0, 200)}...</p>
                        <p><i className="far fa-clock"></i> Deadline: {job.deadline}</p>
                      </Col>
                    </Row>
                  </Card>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : <p className="text-center">No featured jobs available right now.</p>}
        </Container>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Why Choose JobConnect?</h2>
          <Row className="text-center">
            <Col md={4}>
              <i className="fas fa-database fa-3x text-primary mb-3"></i>
              <h5>10,000+ Verified Jobs</h5>
              <p>Access the largest verified job database in Bangladesh with daily updates.</p>
            </Col>
            <Col md={4}>
              <i className="fas fa-building fa-3x text-primary mb-3"></i>
              <h5>500+ Employers</h5>
              <p>Connect directly with top companies and hiring managers.</p>
            </Col>
            <Col md={4}>
              <i className="fas fa-user-graduate fa-3x text-primary mb-3"></i>
              <h5>Career Resources</h5>
              <p>Free resume templates, interview tips, and expert advice for job seekers.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-4">How It Works</h2>
          <Row className="text-center">
            <Col md={3}>
              <i className="fas fa-user-plus fa-2x mb-2 text-success"></i>
              <h6>1. Sign Up</h6>
              <p>Create a free account as a job seeker or employer.</p>
            </Col>
            <Col md={3}>
              <i className="fas fa-file-alt fa-2x mb-2 text-success"></i>
              <h6>2. Build Profile</h6>
              <p>Add your resume, skills, and preferences.</p>
            </Col>
            <Col md={3}>
              <i className="fas fa-search fa-2x mb-2 text-success"></i>
              <h6>3. Search & Apply</h6>
              <p>Browse jobs and apply with one click.</p>
            </Col>
            <Col md={3}>
              <i className="fas fa-handshake fa-2x mb-2 text-success"></i>
              <h6>4. Get Hired</h6>
              <p>Communicate directly with employers and get hired!</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4">What Users Say</h2>
          <Carousel indicators={false}>
            {[
              {
                name: "Sadia Akter",
                role: "Marketing Executive",
                text: "Thanks to JobConnect, I got hired within a week! The process was smooth and simple."
              },
              {
                name: "Arif Hasan",
                role: "Company HR",
                text: "We found great candidates in less time. A must-have tool for every recruiter."
              }
            ].map((review, idx) => (
              <Carousel.Item key={idx}>
                <div className="text-center px-5">
                  <blockquote className="blockquote">
                    <p className="mb-4">“{review.text}”</p>
                    <footer className="blockquote-footer">
                      {review.name}, <cite>{review.role}</cite>
                    </footer>
                  </blockquote>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section py-5 text-white text-center">
        <Container>
          <h2>Ready to Get Started?</h2>
          <p>Whether you're hiring or job hunting — JobConnect is your ultimate solution.</p>
          <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
            <Button variant="light" size="lg" href="/register">Join as Job Seeker</Button>
            <Button variant="outline-light" size="lg" href="/company/register">Register as Employer</Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
