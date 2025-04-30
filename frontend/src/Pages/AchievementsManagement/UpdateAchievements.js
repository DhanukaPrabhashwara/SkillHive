import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

function UpdateAchievements() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    postOwnerID: '',
    postOwnerName: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch achievement');
        }
        const data = await response.json();
        setFormData(data);
        if (data.imageUrl) {
          setPreviewImage(`http://localhost:8080/achievements/images/${data.imageUrl}`);
        }
      } catch (error) {
        console.error('Error fetching Achievements data:', error);
        alert('Error loading achievement data');
      }
    };
    fetchAchievement();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        
        const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }
        imageUrl = await uploadResponse.text();
      }

      // Update achievement data
      const updatedData = { ...formData, imageUrl };
      const response = await fetch(`http://localhost:8080/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Achievement updated successfully!');
        window.location.href = '/allAchievements';
      } else {
        throw new Error('Failed to update achievement');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred during update');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('Achievement deleted successfully!');
          navigate('/allAchievements');
        } else {
          alert('Failed to delete achievement.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error deleting achievement');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="animated-shape"></div>
        <div className="animated-shape"></div>
        <div className="animated-shape"></div>
      </div>
      
      <div className="register-card">
        <div className="register-header">
          <h1>Update Achievement</h1>
          <div className="header-actions">
            <FaEdit className="header-icon" />
            <RiDeleteBin6Fill 
              className="header-icon delete" 
              onClick={handleDelete}
            />
          </div>
          <p>Edit your achievement details</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form-new">
          <div className="profile-upload" onClick={() => document.querySelector('input[type="file"]').click()}>
            {previewImage ? (
              <img 
                src={previewImage} 
                alt="Achievement" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <div className="upload-placeholder">
                Click to upload image
              </div>
            )}
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div className="form-columns">
            <div className="input-group">
              <input
                type="text"
                name="title"
                placeholder="Achievement Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Category</option>
                <option value="Coding">Coding</option>
                <option value="Photography">Photography</option>
                <option value="DIY cards">DIY cards</option>
                <option value="Public Speaking Skills">Public Speaking Skills</option>
                <option value="Finance for Beginners">Finance for Beginners</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <textarea
              name="description"
              placeholder="Describe your achievement"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
            />
          </div>

          <div className="input-group">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="register-button"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Achievement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateAchievements;