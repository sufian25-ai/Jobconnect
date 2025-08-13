import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Alert, 
  Card, 
  Image, 
  ProgressBar,
  Tab,
  Tabs,
  ListGroup,
  Badge
} from "react-bootstrap";
import { 
  FaBuilding, 
  FaEnvelope, 
  FaBriefcase, 
  FaFileUpload, 
  FaEye,
  FaLinkedin,
  FaGlobe,
  FaPhone,
  FaMapMarkerAlt,
  FaUsers,
  FaIndustry,
  FaRegCalendarAlt,
  FaSave,
  FaChartLine
} from "react-icons/fa";
import api from "../services/api";
import "./CompanyProfile.css";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    industry: "",
    founded: "",
    description: "",
    website: "",
    linkedin: "",
    logo: "",
    banner: "",
    employees: "",
    products: "",
    services: "",
    achievements: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [jobOpenings, setJobOpenings] = useState([]);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const res = await api.get("/company/get_profile.php");
        if (res.data.success) {
          setCompany(res.data.company);
          setJobOpenings(res.data.job_openings || []);
          setError("");
        } else {
          setError(res.data.message || "Failed to load company profile");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/company/update_profile.php", company);
      if (res.data.success) {
        setSuccess("Company profile updated successfully!");
        setError("");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.data.message || "Update failed");
      }
    } catch (err) {
      setError("Failed to update company profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    setError("");
    setSuccess("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await api.post("/company/upload_file.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });

      if (res.data.success) {
        setCompany(prev => ({
          ...prev,
          [type]: res.data.filename
        }));
        setSuccess(`${type === "logo" ? "Logo" : "Banner"} uploaded successfully!`);
        setTimeout(() => {
          setSuccess("");
          setUploadProgress(0);
        }, 3000);
      } else {
        setError(res.data.message || "Upload failed");
        setUploadProgress(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload file");
      setUploadProgress(0);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setError("Please select an image file (JPEG, PNG)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Logo file too large (max 2MB)");
        return;
      }
      setError("");
      handleFileUpload(file, "logo");
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setError("Please select an image file (JPEG, PNG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Banner file too large (max 5MB)");
        return;
      }
      setError("");
      handleFileUpload(file, "banner");
    }
  };

  if (loading && !company.name) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3">Loading company profile...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5 company-profile-container">
      {/* Company Banner */}
      <div className="company-banner mb-4">
        {company.banner ? (
          <Image
            src={`http://localhost/Jobconnect/backend/uploads/company_banners/${company.banner}`}
            fluid
            className="banner-image"
          />
        ) : (
          <div className="banner-placeholder">
            <FaBuilding size={60} />
          </div>
        )}
        <label htmlFor="banner-upload" className="banner-upload-label">
          <input
            type="file"
            id="banner-upload"
            accept="image/*"
            onChange={handleBannerChange}
            className="d-none"
          />
          Change Banner
        </label>
      </div>

      <Row>
        <Col lg={4}>
          <Card className="company-sidebar shadow-sm mb-4">
            <Card.Body className="text-center">
              <div className="company-logo-container mb-3">
                {company.logo ? (
                  <Image
                    src={`http://localhost/Jobconnect/backend/uploads/company_logos/${company.logo}`}
                    roundedCircle
                    className="company-logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-company.png";
                    }}
                  />
                ) : (
                  <div className="logo-placeholder">
                    <FaBuilding size={40} />
                  </div>
                )}
                <label htmlFor="logo-upload" className="logo-upload-label">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="d-none"
                  />
                  Change Logo
                </label>
              </div>
              
              <h3>{company.name}</h3>
              <p className="text-muted">{company.industry}</p>
              
              <div className="company-stats mb-4">
                <div className="stat-item">
                  <FaUsers className="stat-icon" />
                  <span>{company.employees || "N/A"} Employees</span>
                </div>
                <div className="stat-item">
                  <FaIndustry className="stat-icon" />
                  <span>{company.industry || "Not Specified"}</span>
                </div>
                <div className="stat-item">
                  <FaRegCalendarAlt className="stat-icon" />
                  <span>Founded {company.founded || "N/A"}</span>
                </div>
              </div>
              
              <div className="social-links mb-3">
                {company.linkedin && (
                  <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="social-icon" />
                  </a>
                )}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    <FaGlobe className="social-icon" />
                  </a>
                )}
              </div>
              
              <Button 
                variant="primary" 
                onClick={() => navigate("/post-job")}
                className="mb-3"
              >
                Post New Job
              </Button>
              
              <div className="profile-completion">
                <h6 className="text-start">Profile Completion</h6>
                <ProgressBar
                  now={calculateProfileCompletion(company)}
                  label={`${calculateProfileCompletion(company)}%`}
                  variant="success"
                  className="mb-2"
                />
                <small className="text-muted">
                  Complete your profile to attract better candidates
                </small>
              </div>
            </Card.Body>
          </Card>
          
          {/* Current Job Openings */}
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h5>Current Job Openings</h5>
            </Card.Header>
            <Card.Body>
              {jobOpenings.length > 0 ? (
                <ListGroup variant="flush">
                  {jobOpenings.map((job, index) => (
                    <ListGroup.Item key={index} action onClick={() => navigate(`/jobs/${job.id}`)}>
                      <div className="d-flex justify-content-between">
                        <span>{job.title}</span>
                        <Badge bg={job.status === 'active' ? 'success' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                      <small className="text-muted">{job.location} • {job.type}</small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No active job openings</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="basic" title="Basic Info">
                  <Form onSubmit={handleSubmit}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaBuilding className="me-2" />
                            Company Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={company.name}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaIndustry className="me-2" />
                            Industry
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="industry"
                            value={company.industry}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaRegCalendarAlt className="me-2" />
                            Founded Year
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="founded"
                            value={company.founded}
                            onChange={handleChange}
                            placeholder="YYYY"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaUsers className="me-2" />
                            Employees
                          </Form.Label><br />
                          <Form.Select
                            name="employees"
                            value={company.employees}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            <option value="1-10">1-10</option>
                            <option value="11-50">11-50</option>
                            <option value="51-200">51-200</option>
                            <option value="201-500">201-500</option>
                            <option value="501-1000">501-1000</option>
                            <option value="1000+">1000+</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaPhone className="me-2" />
                            Phone
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={company.phone}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaEnvelope className="me-2" />
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={company.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaMapMarkerAlt className="me-2" />
                        Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={company.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaBriefcase className="me-2" />
                        Company Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="description"
                        value={company.description}
                        onChange={handleChange}
                        placeholder="Tell us about your company..."
                      />
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" disabled={loading}>
                      <FaSave className="me-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </Form>
                </Tab>
                
                <Tab eventKey="details" title="Company Details">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaChartLine className="me-2" />
                        Products
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="products"
                        value={company.products}
                        onChange={handleChange}
                        placeholder="List your main products"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaBriefcase className="me-2" />
                        Services
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="services"
                        value={company.services}
                        onChange={handleChange}
                        placeholder="Describe your services"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaIndustry className="me-2" />
                        Achievements & Awards
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="achievements"
                        value={company.achievements}
                        onChange={handleChange}
                        placeholder="Notable achievements, awards, or recognitions"
                      />
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" disabled={loading}>
                      <FaSave className="me-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </Form>
                </Tab>
                
                <Tab eventKey="social" title="Social Media">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaGlobe className="me-2" />
                        Website
                      </Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        value={company.website}
                        onChange={handleChange}
                        placeholder="https://yourcompany.com"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaLinkedin className="me-2" />
                        LinkedIn Page
                      </Form.Label>
                      <Form.Control
                        type="url"
                        name="linkedin"
                        value={company.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" disabled={loading}>
                      <FaSave className="me-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </Form>
                </Tab>
                
                <Tab eventKey="media" title="Company Media">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Company Logo
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                        <Form.Text className="text-muted">
                          Recommended size: 300x300px, max 2MB
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Company Banner
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleBannerChange}
                        />
                        <Form.Text className="text-muted">
                          Recommended size: 1200x300px, max 5MB
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <ProgressBar
                      now={uploadProgress}
                      label={`${uploadProgress}%`}
                      className="mb-3"
                    />
                  )}
                  
                  <div className="media-preview">
                    <h5>Current Media</h5>
                    <Row>
                      <Col md={6}>
                        <div className="media-preview-item">
                          <h6>Logo</h6>
                          {company.logo ? (
                            <Image
                              src={`http://localhost/Jobconnect/backend/uploads/company_logos/${company.logo}`}
                              thumbnail
                              className="preview-image"
                            />
                          ) : (
                            <div className="no-media">
                              <FaBuilding size={30} />
                              <span>No logo uploaded</span>
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="media-preview-item">
                          <h6>Banner</h6>
                          {company.banner ? (
                            <Image
                              src={`http://localhost/Jobconnect/backend/uploads/company_banners/${company.banner}`}
                              thumbnail
                              className="preview-image"
                            />
                          ) : (
                            <div className="no-media">
                              <FaBuilding size={30} />
                              <span>No banner uploaded</span>
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const calculateProfileCompletion = (company) => {
  const fields = [
    'name',
    'email',
    'industry',
    'description',
    'website',
    'logo',
    'products'
  ];
  
  const completedFields = fields.filter(field => {
    return company[field] && company[field].toString().trim() !== '';
  }).length;
  
  return Math.round((completedFields / fields.length) * 100);
};

export default CompanyProfile;