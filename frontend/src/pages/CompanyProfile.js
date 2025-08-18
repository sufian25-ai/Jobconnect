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
  Badge,
  Modal,
  Spinner
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
  FaChartLine,
  FaEdit,
  FaTimes,
  FaPlus,
  FaTrash
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
  const [editMode, setEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditField, setCurrentEditField] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/company/update_profile.php", company);
      if (res.data.success) {
        setSuccess("Profile updated successfully!");
        setError("");
        setTimeout(() => setSuccess(""), 3000);
        setEditMode(false);
      } else {
        setError(res.data.message || "Update failed");
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (fieldName, currentValue) => {
    setCurrentEditField(fieldName);
    setTempValue(currentValue || "");
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setCompany(prev => ({ ...prev, [currentEditField]: tempValue }));
    setShowEditModal(false);
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

  const renderEditableField = (fieldName, label, value, isTextArea = false, rows = 3) => {
    return (
      <div className="editable-field mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="form-label fw-bold">{label}</label>
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => handleEditClick(fieldName, value)}
            className="p-0 edit-btn"
          >
            <FaEdit className="text-primary" />
          </Button>
        </div>
        {isTextArea ? (
          <div className="form-control-static p-3 bg-light rounded" style={{ whiteSpace: 'pre-wrap', minHeight: '100px' }}>
            {value || <span className="text-muted">Not specified</span>}
          </div>
        ) : (
          <div className="form-control-static p-2 bg-light rounded">
            {value || <span className="text-muted">Not specified</span>}
          </div>
        )}
      </div>
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

  if (loading && !company.name) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3">Loading company profile...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5 company-profile-container">
      {/* Edit Field Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit {currentEditField.replace(/_/g, ' ')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>{currentEditField.replace(/_/g, ' ')}</Form.Label>
            {['description', 'products', 'services', 'achievements'].includes(currentEditField) ? (
              <Form.Control
                as="textarea"
                rows={5}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="mb-3"
              />
            ) : (
              <Form.Control
                type={currentEditField === 'founded' ? 'number' : 'text'}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="mb-3"
              />
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Company Banner */}
      <div className="company-banner mb-4 position-relative">
        {company.banner ? (
          <Image
            src={`http://localhost/Jobconnect/backend/uploads/company_banners/${company.banner}`}
            fluid
            className="banner-image rounded"
          />
        ) : (
          <div className="banner-placeholder d-flex align-items-center justify-content-center">
            <FaBuilding size={60} className="text-muted" />
          </div>
        )}
        <label htmlFor="banner-upload" className="banner-upload-label btn btn-sm btn-light">
          <input
            type="file"
            id="banner-upload"
            accept="image/*"
            onChange={handleBannerChange}
            className="d-none"
          />
          <FaEdit className="me-1" /> Change Banner
        </label>
      </div>

      <Row>
        <Col lg={4}>
          <Card className="company-sidebar shadow-sm mb-4">
            <Card.Body className="text-center">
              <div className="company-logo-container mb-3 position-relative">
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
                  <div className="logo-placeholder rounded-circle d-flex align-items-center justify-content-center">
                    <FaBuilding size={40} className="text-muted" />
                  </div>
                )}
                <label htmlFor="logo-upload" className="logo-upload-label btn btn-sm btn-light">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="d-none"
                  />
                  <FaEdit className="me-1" /> Change Logo
                </label>
              </div>
              
              <h3 className="mb-1">{company.name || "Company Name"}</h3>
              <p className="text-muted mb-3">{company.industry || "Industry"}</p>
              
              <div className="company-stats mb-4">
                <div className="stat-item mb-2">
                  <FaUsers className="stat-icon me-2" />
                  <span>{company.employees || "N/A"} Employees</span>
                </div>
                <div className="stat-item mb-2">
                  <FaIndustry className="stat-icon me-2" />
                  <span>{company.industry || "Not Specified"}</span>
                </div>
                <div className="stat-item">
                  <FaRegCalendarAlt className="stat-icon me-2" />
                  <span>Founded {company.founded || "N/A"}</span>
                </div>
              </div>
              
              <div className="social-links mb-3">
                {company.linkedin && (
                  <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaLinkedin size={20} />
                  </a>
                )}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaGlobe size={20} />
                  </a>
                )}
              </div>
              
              <Button 
                variant="primary" 
                onClick={() => navigate("/post-job")}
                className="mb-3 w-100"
              >
                <FaPlus className="me-1" /> Post New Job
              </Button>
              
              <div className="profile-completion">
                <h6 className="text-start mb-2">Profile Completion</h6>
                <ProgressBar
                  now={calculateProfileCompletion(company)}
                  label={`${calculateProfileCompletion(company)}%`}
                  variant={calculateProfileCompletion(company) >= 75 ? "success" : 
                         calculateProfileCompletion(company) >= 50 ? "warning" : "danger"}
                  className="mb-2"
                  style={{ height: "10px" }}
                />
                <small className="text-muted">
                  Complete your profile to attract better candidates
                </small>
              </div>
            </Card.Body>
          </Card>
          
          {/* Current Job Openings */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Current Job Openings</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {jobOpenings.length > 0 ? (
                <ListGroup variant="flush">
                  {jobOpenings.map((job, index) => (
                    <ListGroup.Item 
                      key={index} 
                      action 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="py-3 px-3 border-bottom"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{job.title}</h6>
                          <small className="text-muted">{job.location} • {job.type}</small>
                        </div>
                        <Badge pill bg={job.status === 'active' ? 'success' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4">
                  <FaBriefcase size={32} className="text-muted mb-3" />
                  <p className="text-muted">No active job openings</p>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate("/post-job")}
                  >
                    Post a Job
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Company Information</h4>
                {editMode ? (
                  <div>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setEditMode(false)}
                      className="me-2"
                      size="sm"
                    >
                      <FaTimes className="me-1" /> Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleSubmit}
                      disabled={isSaving}
                      size="sm"
                    >
                      {isSaving ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-1" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-1" /> Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setEditMode(true)}
                    size="sm"
                  >
                    <FaEdit className="me-1" /> Edit Profile
                  </Button>
                )}
              </div>

              {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
              {success && <Alert variant="success" className="mb-4">{success}</Alert>}

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
                id="company-profile-tabs"
              >
                <Tab eventKey="basic" title="Basic Info">
                  {editMode ? (
                    <Form onSubmit={handleSubmit}>
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
                              type="number"
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
                            </Form.Label>
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
                    </Form>
                  ) : (
                    <div className="view-mode">
                      {renderEditableField("name", "Company Name", company.name)}
                      {renderEditableField("industry", "Industry", company.industry)}
                      {renderEditableField("founded", "Founded Year", company.founded)}
                      {renderEditableField("employees", "Employees", company.employees)}
                      {renderEditableField("phone", "Phone", company.phone)}
                      {renderEditableField("email", "Email", company.email)}
                      {renderEditableField("address", "Address", company.address)}
                      {renderEditableField("description", "Description", company.description, true, 5)}
                    </div>
                  )}
                </Tab>
                
                <Tab eventKey="details" title="Company Details">
                  {editMode ? (
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
                    </Form>
                  ) : (
                    <div className="view-mode">
                      {renderEditableField("products", "Products", company.products, true)}
                      {renderEditableField("services", "Services", company.services, true)}
                      {renderEditableField("achievements", "Achievements", company.achievements, true)}
                    </div>
                  )}
                </Tab>
                
                <Tab eventKey="social" title="Social Media">
                  {editMode ? (
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
                    </Form>
                  ) : (
                    <div className="view-mode">
                      {renderEditableField("website", "Website", company.website)}
                      {renderEditableField("linkedin", "LinkedIn Page", company.linkedin)}
                    </div>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyProfile;