import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light pt-5 pb-3">
      <Container>
        <Row>
          {/* Company Info */}
          <Col md={4} className="mb-4">
            <h5 className="mb-3">JobConnect</h5>
            <p>
              JobConnect is your trusted career partner. We help professionals find their dream jobs and companies hire top talents.
            </p>
            <div className="social-icons mt-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/">Home</a></li>
              <li><a href="/jobs">Browse Jobs</a></li>
              <li><a href="/companies">Companies</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={4} className="mb-4">
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled contact-info">
              <li><FaMapMarkerAlt /> 1234, Gulshan, Dhaka, Bangladesh</li>
              <li><FaEnvelope /> info@jobconnect.com</li>
              <li><FaPhoneAlt /> +880 1700 123 456</li>
            </ul>
          </Col>
        </Row>

        {/* Bottom text */}
        <Row>
          <Col className="text-center mt-4">
            <small>© {new Date().getFullYear()} JobConnect. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
