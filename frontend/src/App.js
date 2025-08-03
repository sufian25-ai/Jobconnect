import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ContactForm from "./pages/ContactForm";
import AboutPage from "./about/AboutPage";

import AdminDashboard from "./pages/AdminDashboard";
import Navigation from "./pages/Navigation";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CompanyDashboard from "./pages/CompanyDashboard";
import PostJob from "./pages/PostJob";
import Jobs from "./pages/Jobs";
import ApplyForm from "./pages/ApplyForm";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./Footer/Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';


function App() {

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
  }, []);
  return (
    
    
    <Router>
      <Navigation />
  
      <Routes>

      {/* ✅ Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* ✅ User Routes */}
        <Route path="/" element={<Home />} />
       <Route path="/Contact" element={<ContactForm />} />
        <Route path="/About" element={<AboutPage />} />
        
        {/* User Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/dashboard" element={<CompanyDashboard />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/apply/:jobId" element={<ApplyForm />} />
        
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
