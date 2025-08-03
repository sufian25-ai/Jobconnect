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
  Tabs
} from "react-bootstrap";
import { 
  FaUser, 
  FaEnvelope, 
  FaBriefcase, 
  FaFileUpload, 
  FaEye,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaSave
} from "react-icons/fa";
import api from "../services/api";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    skills: "",
    experience: "",
    education: "",
    bio: "",
    linkedin: "",
    github: "",
    website: "",
    resume: "",
    profile_img: ""
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/get_profile.php");
        if (res.data.success) {
          setProfile(res.data.profile);
        } else {
          setError(res.data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/user/update_profile.php", profile);
      if (res.data.success) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.data.message || "Update failed");
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await api.post("/user/upload_file.php", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });

      if (res.data.success) {
        setProfile(prev => ({
          ...prev,
          [type === "resume" ? "resume" : "profile_img"]: res.data.filename
        }));
        setSuccess(`${type === "resume" ? "Resume" : "Profile image"} uploaded successfully!`);
        setTimeout(() => {
          setSuccess("");
          setUploadProgress(0);
        }, 3000);
      } else {
        setError(res.data.message || "Upload failed");
      }
    } catch (err) {
      setError("Failed to upload file");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setError("Please select an image file");
        return;
      }
      setProfileImage(file);
      handleFileUpload(file, "profile");
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("application/pdf")) {
        setError("Please select a PDF file");
        return;
      }
      setResumeFile(file);
      handleFileUpload(file, "resume");
    }
  };

  if (loading && !profile.name) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3">Loading your profile...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5 profile-container">
      <Row>
        <Col lg={4}>
          <Card className="profile-sidebar shadow-sm mb-4">
            <Card.Body className="text-center">
              <div className="profile-image-container mb-3">
                {profile.profile_img ? (
                  <Image
                    src={`/uploads/profile_images/${profile.profile_img}`}
                    roundedCircle
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-image-placeholder">
                    <FaUser size={40} />
                  </div>
                )}
                <label htmlFor="profile-image-upload" className="profile-image-upload-label">
                  <input
                    type="file"
                    id="profile-image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="d-none"
                  />
                  Change Photo
                </label>
              </div>
              
              <h4>{profile.name}</h4>
              <p className="text-muted">{profile.email}</p>
              
              {profile.resume && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mb-3"
                  href={`/uploads/resumes/${profile.resume}`}
                  target="_blank"
                >
                  <FaEye className="me-2" />
                  View Resume
                </Button>
              )}
              
              <div className="profile-completion mb-4">
                <h6 className="text-start">Profile Completion</h6>
                <ProgressBar
                  now={calculateProfileCompletion(profile)}
                  label={`${calculateProfileCompletion(profile)}%`}
                  variant="success"
                  className="mb-2"
                />
                <small className="text-muted">
                  Complete your profile to increase your visibility
                </small>
              </div>
              
              <div className="social-links">
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="social-icon" />
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub className="social-icon" />
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    <FaGlobe className="social-icon" />
                  </a>
                )}
              </div>
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
                            <FaUser className="me-2" />
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            required
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
                            value={profile.email}
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
                            <FaPhone className="me-2" />
                            Phone
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaMapMarkerAlt className="me-2" />
                            Address
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={profile.address}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaBriefcase className="me-2" />
                        Professional Bio
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                      />
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" disabled={loading}>
                      <FaSave className="me-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </Form>
                </Tab>
                
                <Tab eventKey="professional" title="Professional">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaBriefcase className="me-2" />
                        Skills
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="skills"
                        value={profile.skills}
                        onChange={handleChange}
                        placeholder="List your skills (comma separated)"
                      />
                      <Form.Text className="text-muted">
                        Example: JavaScript, React, Node.js, Python
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaBriefcase className="me-2" />
                        Experience
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="experience"
                        value={profile.experience}
                        onChange={handleChange}
                        placeholder="Describe your work experience"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaGraduationCap className="me-2" />
                        Education
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="education"
                        value={profile.education}
                        onChange={handleChange}
                        placeholder="Your educational background"
                      />
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" disabled={loading}>
                      <FaSave className="me-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </Form>
                </Tab>
                
                <Tab eventKey="social" title="Social">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaLinkedin className="me-2" />
                        LinkedIn Profile
                      </Form.Label>
                      <Form.Control
                        type="url"
                        name="linkedin"
                        value={profile.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaGithub className="me-2" />
                        GitHub Profile
                      </Form.Label>
                      <Form.Control
                        type="url"
                        name="github"
                        value={profile.github}
                        onChange={handleChange}
                        placeholder="https://github.com/yourusername"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaGlobe className="me-2" />
                        Personal Website
                      </Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        value={profile.website}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com"
                      />
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" disabled={loading}>
                      <FaSave className="me-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </Form>
                </Tab>
                
                <Tab eventKey="resume" title="Resume">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaFileUpload className="me-2" />
                      Upload Resume (PDF only)
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeChange}
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <ProgressBar
                        now={uploadProgress}
                        label={`${uploadProgress}%`}
                        className="mt-2"
                      />
                    )}
                    {profile.resume && (
                      <div className="mt-3">
                        <Alert variant="info">
                          Current resume:{" "}
                          <a
                            href={`/uploads/resumes/${profile.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Resume
                          </a>
                        </Alert>
                      </div>
                    )}
                  </Form.Group>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (profile) => {
  const fields = [
    'name',
    'email',
    'skills',
    'experience',
    'education',
    'resume',
    'profile_img'
  ];
  
  const completedFields = fields.filter(field => {
    return profile[field] && profile[field].toString().trim() !== '';
  }).length;
  
  return Math.round((completedFields / fields.length) * 100);
};

export default Profile;