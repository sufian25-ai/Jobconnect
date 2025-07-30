import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
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


function App() {
  return (
    
    
    <Router>
      <Navigation />
  
      <Routes>

      {/* ✅ Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* ✅ User Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/dashboard" element={<CompanyDashboard />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/apply/:jobId" element={<ApplyForm />} />
        
      </Routes>
    </Router>
  );
}

export default App;
