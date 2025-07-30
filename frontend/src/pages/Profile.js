// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import api from "../services/api";


// const Profile = () => {
//   const [profile, setProfile] = useState({
//     name: "", email: "", skills: "", experience: "", resume: "", profile_img: ""
//   });

//   const [resume, setResume] = useState(null);

//   useEffect(() => {
//     axios.get("/user/get_profile.php").then(res => {
//       setProfile(res.data);
//     });
//   }, []);

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     axios.post("/user/update_profile.php", profile)
//       .then(res => alert(res.data.message));
//   };

//   const handleResumeUpload = (e) => {
//     const fileData = new FormData();
//     fileData.append("resume", resume);

//     axios.post("/user/upload_resume.php", fileData)
//       .then(res => alert(res.data.message));
//   };

//   return (
//     <div className="container mt-4">
//       <h2>My Profile</h2>
//       <input name="name" value={profile.name} onChange={handleChange} placeholder="Name" className="form-control mb-2"/>
//       <input name="email" value={profile.email} onChange={handleChange} placeholder="Email" className="form-control mb-2"/>
//       <input name="skills" value={profile.skills} onChange={handleChange} placeholder="Skills" className="form-control mb-2"/>
//       <input name="experience" value={profile.experience} onChange={handleChange} placeholder="Experience" className="form-control mb-2"/>
      
//       <button onClick={handleSubmit} className="btn btn-primary">Update Profile</button>

//       <hr />

//       <input type="file" onChange={(e) => setResume(e.target.files[0])} />
//       <button onClick={handleResumeUpload} className="btn btn-secondary mt-2">Upload Resume</button>

//       {profile.resume && <p className="mt-2">📄 Resume: <a href={`/uploads/resumes/${profile.resume}`} target="_blank" rel="noreferrer">View</a></p>}
//     </div>
//   );
// };

// export default Profile;
