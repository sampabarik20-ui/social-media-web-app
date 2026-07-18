import { jwtDecode } from "jwt-decode";
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../reducers/authReducer";
import api from "../api";


const UpdateProfile= () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const currentUser = jwtDecode(token);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");

      setFormData({
        username: response.data.username || "",
        email: response.data.email || "",
        bio: response.data.bio || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  fetchUser();
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'profileImage') {
      setProfileImage(e.target.files[0]);
    } else if (e.target.name === 'coverImage') {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('bio', formData.bio);
    if (profileImage) data.append('profileImage', profileImage);
    if (coverImage) data.append('coverImage', coverImage);

    try {
       await api.put("/users/profile/update", data);
       await dispatch(fetchCurrentUser());
       alert("Profile updated successfully!");
       navigate(`/profile/${currentUser._id}`, { replace: true });
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
         
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
    
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea
            className="form-control"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Profile Image</label>
          <input
            type="file"
            className="form-control"
            name="profileImage"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cover Image</label>
          <input
            type="file"
            className="form-control"
            name="coverImage"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile
