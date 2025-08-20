import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel, Card, Badge } from 'react-bootstrap';

import api from '../services/api';
import './Home.css';
import { 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaBriefcase,
  FaRegClock,
  FaStar,
  FaDatabase, 
  FaBuilding, 
  FaUserGraduate,
  FaRocket,
  FaShieldAlt,
  FaHeadset,
  FaUserPlus, 
  FaFileAlt, 
  FaSearch, 
  FaHandshake,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await api.get('/jobs/list.php');
        if (res.data.success) {
          // Process jobs to ensure proper logo URLs
          const jobsWithLogos = res.data.jobs.map(job => ({
            ...job,
            // Construct proper URL for company logo
            company_logo: job.company_logo 
              ? `http://localhost/Jobconnect/backend/uploads/company_logos/${job.company_logo}`
              : 'https://via.placeholder.com/150x150?text=No+Logo'
          }));
          setFeaturedJobs(jobsWithLogos);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  // Custom carousel controls
  const CustomPrevIcon = () => (
    <span className="carousel-control-prev-icon" aria-hidden="true">
      <FaChevronLeft />
    </span>
  );

  const CustomNextIcon = () => (
    <span className="carousel-control-next-icon" aria-hidden="true">
      <FaChevronRight />
    </span>
  );

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section text-white d-flex align-items-center">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="hero-title mb-3">Find Your Job with JobConnect</h1>
              <p className="lead">Connecting top talent with top companies across Bangladesh. 10,000+ jobs await.</p>
              <Button variant="light" size="lg" href="/jobs">Browse Jobs</Button>
            </Col>
            <Col lg={6}>
              <img src="http://localhost/Jobconnect/frontend/src/pages/images/hero-image.png" alt="Job Search" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* FEATURED JOBS - CAROUSEL VERSION */}
      <section className="featured-jobs py-5">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Featured Jobs</h2>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="outline-primary" size="sm" className="active">All Jobs</Button>
              <Button variant="outline-primary" size="sm">Remote</Button>
              <Button variant="outline-primary" size="sm">Full-time</Button>
              <Button variant="outline-primary" size="sm">Part-time</Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} />
              <p className="mt-3">Loading featured jobs...</p>
            </div>
          ) : featuredJobs.length ? (
            <div className="position-relative">
              <Carousel 
                indicators={true} 
                interval={5000}
                nextIcon={<CustomNextIcon />}
                prevIcon={<CustomPrevIcon />}
                className="job-carousel"
              >
                {featuredJobs.slice(0, 6).map((job) => (
                  <Carousel.Item key={job.id}>
                    <div className="job-slide p-4">
                      <Row className="align-items-center">
                        <Col md={4} className="text-center">
                          <div className="company-logo-slide mb-3">
                            <img 
                              src={job.company_logo} 
                              alt={job.company_name} 
                              className="img-fluid rounded"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150x150?text=Logo+Not+Found';
                              }}
                            />
                          </div>
                          <h4 className="company-name">{job.company_name}</h4>
                          <div className="rating mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={i < 4 ? 'text-warning' : 'text-muted'} 
                              />
                            ))}
                          </div>
                          <Badge variant="primary" className="mb-3">
                            {job.job_type || 'Full-time'}
                          </Badge>
                        </Col>
                        <Col md={8}>
                          <div className="job-details-slide">
                            <h3 className="job-title">{job.title}</h3>
                            <div className="job-meta mb-3">
                              <div className="detail-item">
                                <FaMapMarkerAlt className="icon" />
                                <span>{job.location}</span>
                              </div>
                              <div className="detail-item">
                                <FaMoneyBillWave className="icon" />
                                <span>৳{job.salary}</span>
                              </div>
                              {/* <div className="detail-item">
                                <FaBriefcase className="icon" />
                                <span>{job.experience || '2+ Years'}</span>
                              </div> */}
                            </div>
                            <p className="job-description">{job.description?.slice(0, 150)}...</p>
                            <div className="deadline mb-3">
                              <FaRegClock className="icon" />
                              <span>Apply before: {job.deadline}</span>
                            </div>
                            <div className="action-buttons">
                              <Button variant="outline-primary" size="sm" href={`/job/${job.id}`}>View Details</Button>
                              <Button variant="primary" size="sm" className="ms-2">Apply Now</Button>
                              
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
              <div className="text-center mt-5">
                <Button variant="primary" size="lg" href="/jobs">Browse All Jobs</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <img src="/images/no-jobs.svg" alt="No jobs found" style={{maxWidth: '300px'}} className="img-fluid mb-4" />
              <h4 className="mb-3">No featured jobs available</h4>
              <p className="text-muted">Check back later or browse our full job listings</p>
              <Button variant="primary" href="/jobs">Browse Jobs</Button>
            </div>
          )}
        </Container>
      </section>

    {/* WHY CHOOSE US - ENHANCED VERSION */}
<section className="py-5 why-choose-us">
  <Container>
    <div className="text-center mb-5">
      <h2 className="section-title mb-3">Why Choose JobConnect?</h2>
      <p className="section-subtitle text-muted">Discover what makes us the preferred career platform</p>
    </div>
    
    <Row className="g-4">
      {[
        {
          icon: <FaDatabase className="feature-icon" />,
          title: "Verified Jobs",
          count: 10000,
          suffix: "+",
          description: "Access the largest verified job database in Bangladesh with daily updates.",
          color: "primary"
        },
        {
          icon: <FaBuilding className="feature-icon" />,
          title: "Top Employers",
          count: 500,
          suffix: "+",
          description: "Connect directly with leading companies and hiring managers.",
          color: "success"
        },
        {
          icon: <FaUserGraduate className="feature-icon" />,
          title: "Career Resources",
          count: 25,
          suffix: "+",
          description: "Free resume templates, interview guides, and expert career advice.",
          color: "info"
        },
        {
          icon: <FaRocket className="feature-icon" />,
          title: "Success Rate",
          count: 85,
          suffix: "%",
          description: "Of users find jobs within 3 months of using our platform.",
          color: "warning"
        },
        {
          icon: <FaShieldAlt className="feature-icon" />,
          title: "Security First",
          count: 100,
          suffix: "%",
          description: "Verified profiles and secure application process.",
          color: "danger"
        },
        {
          icon: <FaHeadset className="feature-icon" />,
          title: "Support",
          count: 24,
          suffix: "/7",
          description: "Dedicated career support team available anytime.",
          color: "secondary"
        }
      ].map((feature, index) => (
        <Col lg={4} md={6} key={index}>
          <div className={`feature-card p-4 h-100 bg-white rounded-3 shadow-sm border-start border-5 border-${feature.color}`}>
            <div className={`icon-wrapper mb-4 bg-${feature.color}-light rounded-circle d-inline-flex`}>
              {React.cloneElement(feature.icon, { 
                className: `text-${feature.color} fa-2x` 
              })}
            </div>
            <h3 className="h5 mb-3">
              <CountUp 
                end={feature.count} 
                suffix={feature.suffix}
                duration={2}
                className="counter"
              /> {feature.title}
            </h3>
            <p className="mb-0 text-muted">{feature.description}</p>
          </div>
        </Col>
      ))}
    </Row>
  </Container>
</section>

    {/* HOW IT WORKS - ENHANCED VERSION */}
<section className="how-it-works py-5 position-relative">
  <div className="position-absolute w-100 h-100 top-0 start-0 bg-light z-0"></div>
  <Container className="position-relative z-1">
    <div className="text-center mb-5">
      <h2 className="display-5 fw-bold mb-3">How JobConnect Works</h2>
      <p className="lead text-muted mx-auto" style={{maxWidth: "600px"}}>
        Get started in just 4 simple steps to find your dream job or perfect candidate
      </p>
    </div>

    <div className="position-relative">
      {/* Progress line */}
      <div className="progress-line position-absolute top-50 start-0 end-0 translate-middle-y"></div>
      
      <Row className="g-4 g-lg-5">
        {[
          {
            icon: <FaUserPlus className="step-icon" />,
            step: "1",
            title: "Create Account",
            description: "Register as job seeker or employer in under 2 minutes",
            color: "success"
          },
          {
            icon: <FaFileAlt className="step-icon" />,
            step: "2",
            title: "Complete Profile",
            description: "Build your professional profile with resume and skills",
            color: "info"
          },
          {
            icon: <FaSearch className="step-icon" />,
            step: "3",
            description: "Browse relevant jobs or candidates with smart filters",
            title: "Search & Connect",
            color: "warning"
          },
          {
            icon: <FaHandshake className="step-icon" />,
            step: "4",
            title: "Get Hired/Hire",
            description: "Interview and finalize your perfect match",
            color: "primary"
          }
        ].map((step, index) => (
          <Col lg={3} md={6} key={index}>
            <div 
              className="step-card p-4 h-100 bg-white rounded-3 shadow-sm position-relative"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={`step-number bg-${step.color} text-white rounded-circle d-inline-flex align-items-center justify-content-center`}>
                {step.step}
              </div>
              <div className="icon-wrapper mb-3">
                {React.cloneElement(step.icon, {
                  className: `text-${step.color} fa-2x`
                })}
              </div>
              <h3 className="h5 mb-3">{step.title}</h3>
              <p className="mb-0 text-muted">{step.description}</p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  </Container>
</section>
      {/* TOP COMPANIES - STATIC VERSION */}
<section className="py-5">
  <Container>
    <div className="section-header mb-4 ">
      <h2>Top Companies Hiring Now</h2>
      <p className="text-muted">Leading employers actively hiring</p>
    </div>
    
    <Row>
      {/* Company 1 */}
      <Col md={6} lg={3} className="mb-4">
        <Card className="h-100 company-card text-center">
          <Card.Body>
            <div className="company-logo-container mb-3">
              <img 
                src="https://logo.clearbit.com/grameenphone.com" 
                alt="Grameenphone" 
                className="img-fluid rounded-circle company-logo" 
              />
            </div>
            <h5 className="mb-1">Grameenphone</h5>
            <p className="small text-muted mb-2">Telecommunication</p>
            <div className="rating mb-2">
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-muted" />
            </div>
            <Badge variant="light">42 Open Positions</Badge>
          </Card.Body>
          <Card.Footer className="bg-white border-top-0">
            <Button variant="outline-primary" size="sm" block href="/company/1">View Jobs</Button>
          </Card.Footer>
        </Card>
      </Col>

      {/* Company 2 */}
      <Col md={6} lg={3} className="mb-4">
        <Card className="h-100 company-card text-center">
          <Card.Body>
            <div className="company-logo-container mb-3">
              <img 
                src="https://logo.clearbit.com/bkash.com" 
                alt="bKash" 
                className="img-fluid rounded-circle company-logo" 
              />
            </div>
            <h5 className="mb-1">bKash</h5>
            <p className="small text-muted mb-2">Financial Services</p>
            <div className="rating mb-2">
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
            </div>
            <Badge variant="light">35 Open Positions</Badge>
          </Card.Body>
          <Card.Footer className="bg-white border-top-0">
            <Button variant="outline-primary" size="sm" block href="/company/2">View Jobs</Button>
          </Card.Footer>
        </Card>
      </Col>

      {/* Company 3 */}
      <Col md={6} lg={3} className="mb-4">
        <Card className="h-100 company-card text-center">
          <Card.Body>
            <div className="company-logo-container mb-3">
              <img 
                src="https://logo.clearbit.com/sslwireless.com" 
                alt="SSL Wireless" 
                className="img-fluid rounded-circle company-logo" 
              />
            </div>
            <h5 className="mb-1">SSL Wireless</h5>
            <p className="small text-muted mb-2">IT & Software</p>
            <div className="rating mb-2">
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-muted" />
              <FaStar className="text-muted" />
            </div>
            <Badge variant="light">28 Open Positions</Badge>
          </Card.Body>
          <Card.Footer className="bg-white border-top-0">
            <Button variant="outline-primary" size="sm" block href="/company/3">View Jobs</Button>
          </Card.Footer>
        </Card>
      </Col>

      {/* Company 4 */}
      <Col md={6} lg={3} className="mb-4">
        <Card className="h-100 company-card text-center">
          <Card.Body>
            <div className="company-logo-container mb-3">
              <img 
                src="https://logo.clearbit.com/robi.com.bd" 
                alt="Robi Axiata" 
                className="img-fluid rounded-circle company-logo" 
              />
            </div>
            <h5 className="mb-1">Robi Axiata</h5>
            <p className="small text-muted mb-2">Telecommunication</p>
            <div className="rating mb-2">
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-muted" />
            </div>
            <Badge variant="light">31 Open Positions</Badge>
          </Card.Body>
          <Card.Footer className="bg-white border-top-0">
            <Button variant="outline-primary" size="sm" block href="/company/4">View Jobs</Button>
          </Card.Footer>
        </Card>
      </Col>

      {/* Company 5 */}
      <Col md={6} lg={3} className="mb-4">
        <Card className="h-100 company-card text-center">
          <Card.Body>
            <div className="company-logo-container mb-3">
              <img 
                src="https://logo.clearbit.com/akij.net" 
                alt="Akij Group" 
                className="img-fluid rounded-circle company-logo" 
              />
            </div>
            <h5 className="mb-1">Akij Group</h5>
            <p className="small text-muted mb-2">Conglomerate</p>
            <div className="rating mb-2">
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-muted" />
            </div>
            <Badge variant="light">25 Open Positions</Badge>
          </Card.Body>
          <Card.Footer className="bg-white border-top-0">
            <Button variant="outline-primary" size="sm" block href="/company/5">View Jobs</Button>
          </Card.Footer>
        </Card>
      </Col>

      {/* Company 6 */}
      <Col md={6} lg={3} className="mb-4">
        <Card className="h-100 company-card text-center">
          <Card.Body>
            <div className="company-logo-container mb-3">
              <img 
                src="https://logo.clearbit.com/brac.net" 
                alt="BRAC" 
                className="img-fluid rounded-circle company-logo" 
              />
            </div>
            <h5 className="mb-1">BRAC</h5>
            <p className="small text-muted mb-2">NGO</p>
            <div className="rating mb-2">
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
            </div>
            <Badge variant="light">38 Open Positions</Badge>
          </Card.Body>
          <Card.Footer className="bg-white border-top-0">
            <Button variant="outline-primary" size="sm" block href="/company/6">View Jobs</Button>
          </Card.Footer>
        </Card>
      </Col>

      {/* Company 7 */}
      <Col md={6} lg={3} className="mb-4">
        <Card className="h-100 company-card text-center">
          <Card.Body>
            <div className="company-logo-container mb-3">
              <img 
                src="https://logo.clearbit.com/squarespace.com" 
                alt="Square Pharmaceuticals" 
                className="img-fluid rounded-circle company-logo" 
              />
            </div>
            <h5 className="mb-1">Square Pharmaceuticals</h5>
            <p className="small text-muted mb-2">Pharmaceutical</p>
            <div className="rating mb-2">
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-muted" />
            </div>
            <Badge variant="light">29 Open Positions</Badge>
          </Card.Body>
          <Card.Footer className="bg-white border-top-0">
            <Button variant="outline-primary" size="sm" block href="/company/7">View Jobs</Button>
          </Card.Footer>
        </Card>
      </Col>

      {/* Company 8 */}
      <Col md={6} lg={3} className="mb-4">
        <Card className="h-100 company-card text-center">
          <Card.Body>
            <div className="company-logo-container mb-3">
              <img 
                src="https://logo.clearbit.com/dutchbanglabank.com" 
                alt="Dutch-Bangla Bank" 
                className="img-fluid rounded-circle company-logo" 
              />
            </div>
            <h5 className="mb-1">Dutch-Bangla Bank</h5>
            <p className="small text-muted mb-2">Banking</p>
            <div className="rating mb-2">
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
              <FaStar className="text-warning" />
            </div>
            <Badge variant="light">33 Open Positions</Badge>
          </Card.Body>
          <Card.Footer className="bg-white border-top-0">
            <Button variant="outline-primary" size="sm" block href="/company/8">View Jobs</Button>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
    
    <div className="text-center mt-4">
      <Button variant="outline-primary" href="/companies">Browse All Companies</Button>
    </div>
  </Container>
</section>

{/* TESTIMONIALS - ENHANCED VERSION */}
<section className="py-5 bg-light">
  <Container>
    <div className="text-center mb-5">
      <h2 className="mb-3">What Our Company & Users Say</h2>
      <p className="lead text-muted">Hear from job seekers and employers who found success</p>
    </div>
    
    <Carousel indicators={true} interval={5000} className="testimonial-carousel">
      {[
        {
          name: "Sadia Akter",
          role: "Marketing Executive",
          text: "Thanks to JobConnect, I got hired within a week! The process was smooth and simple.",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg",
          rating: 5
        },
        {
          name: "Arif Hasan",
          role: "HR Manager, Tech Solutions Ltd.",
          text: "We found 3 perfect candidates in just 2 days. This platform saved us weeks of recruitment time.",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
          rating: 5
        },
        {
          name: "Rahim Khan",
          role: "Senior Software Engineer",
          text: "After months of searching, I found my dream job through JobConnect. The matching algorithm is amazing!",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg",
          rating: 4
        }
      ].map((review, idx) => (
        <Carousel.Item key={idx}>
          <div className="testimonial-card p-4 p-md-5 mx-auto">
            <div className="d-flex justify-content-center mb-4">
              <img 
                src={review.avatar} 
                alt={review.name} 
                className="rounded-circle testimonial-avatar"
              />
            </div>
            <div className="rating mb-3">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < review.rating ? 'text-warning' : 'text-muted'} 
                />
              ))}
            </div>
            <blockquote className="mb-4">
              <p className="font-italic">"{review.text}"</p>
            </blockquote>
            <footer>
              <h5 className="mb-1">{review.name}</h5>
              <p className="text-muted mb-0">{review.role}</p>
            </footer>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  </Container>
</section>

      
      {/* JOB CATEGORIES */}
      <section className="py-5 bg-light text-center">
        <Container>
          <div className="section-header mb-4 text-center">
            <h2>Popular Job Categories</h2>
            <p className="text-muted">Browse jobs by category</p>
          </div>
          
          <Row>
            {[
              { name: "Accounting/Finance", jobs: 1245 },
              { name: "Bank/Non-Bank Fin.", jobs: 876 },
              { name: "IT/Telecommunication", jobs: 2345 },
              { name: "Marketing/Sales", jobs: 1892 },
              { name: "Engineer/Architect", jobs: 1543 },
              { name: "Garments/Textile", jobs: 765 },
              { name: "Education/Training", jobs: 432 },
              { name: "HR/Admin", jobs: 678 }
            ].map((category, idx) => (
              <Col md={6} lg={3} key={idx} className="mb-3">
                <div className="category-card p-3 bg-white rounded">
                  <h6 className="mb-1">{category.name}</h6>
                  <p className="small text-muted mb-0">{category.jobs} jobs available</p>
                </div>
              </Col>
            ))}
          </Row>
          
          <div className="text-center mt-4">
            <Button variant="outline-primary" href="/categories">All Categories</Button>
          </div>
        </Container>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section py-5 text-white text-center">
        <Container>
          <h2>Ready to Get Started?</h2>
          <p>Whether you're hiring or job hunting — JobConnect is your ultimate solution.</p>
          <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
            <Button variant="light" size="lg" href="/register">Join as Job Seeker</Button>
            <Button variant="outline-light" size="lg" href="/register">Register as Employer</Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
