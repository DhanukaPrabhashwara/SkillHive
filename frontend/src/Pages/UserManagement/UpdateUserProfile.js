import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import NavBar from '../../Components/NavBar/NavBar';

function UpdateUserProfile() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
    skills: [],
    bio: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  useEffect(() => {
    fetch(`http://localhost:8080/user/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then((data) => setFormData(data))
      .catch((error) => console.error('Error:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        if (profilePicture) {
          const formData = new FormData();
          formData.append('file', profilePicture);
          await fetch(`http://localhost:8080/user/${id}/uploadProfilePicture`, {
            method: 'PUT',
            body: formData,
          });
        }
        alert('Profile updated successfully!');
        navigate('/userProfile');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-container">
      <NavBar />
      <div className="register-background">
        <div className="animated-shape"></div>
        <div className="animated-shape"></div>
        <div className="animated-shape"></div>
      </div>
      
      <div className="register-card">
        <div className="register-header">
          <h1>Update Your Profile</h1>
          <p>Keep your information up to date</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form-new">
          <div className="profile-upload" onClick={() => document.querySelector('input[type="file"]').click()}>
            {previewImage ? (
              <img src={previewImage} alt="Selected Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : formData.profilePicturePath ? (
              <img 
                src={`http://localhost:8080/uploads/profile/${formData.profilePicturePath}`} 
                alt="Current Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <FaUserCircle size={80} color="rgba(255,255,255,0.5)" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            style={{ display: 'none' }}
          />

          <div className="form-columns">
            <div className="input-group">
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => {
                  const re = /^[0-9\b]{0,10}$/;
                  if (re.test(e.target.value)) {
                    handleInputChange(e);
                  }
                }}
                maxLength="10"
                pattern="[0-9]{10}"
                title="Please enter exactly 10 digits."
                required
              />
            </div>
          </div>

          <div className="skills-container">
            <div className="skills-input-group">
              <input
                type="text"
                placeholder="Add your skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
              />
              <button type="button" className="add-skill-button" onClick={handleAddSkill}>
                <IoMdAdd />
              </button>
            </div>
            <div className="skills-list">
              {formData.skills.map((skill, index) => (
                <span key={index} className="skill-badge">
                  {skill}
                  <span className="remove-skill" onClick={() => handleRemoveSkill(skill)}>×</span>
                </span>
              ))}
            </div>
          </div>

          <div className="input-group">
            <textarea
              name="bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="register-button">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUserProfile;