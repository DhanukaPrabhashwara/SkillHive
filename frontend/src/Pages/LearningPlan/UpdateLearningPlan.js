import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import './post.css'
import NavBar from '../../Components/NavBar/NavBar';
import { HiCalendarDateRange } from "react-icons/hi2";

function UpdateLearningPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [templateID, setTemplateID] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/learningPlan/${id}`);
        const { title, description, contentURL, tags, imageUrl, templateID, startDate, endDate, category } = response.data;
        setTitle(title);
        setDescription(description);
        setContentURL(contentURL);
        setTags(tags);
        setExistingImage(imageUrl);
        setTemplateID(templateID);
        setStartDate(startDate);
        setEndDate(endDate);
        setCategory(category);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getEmbedURL = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch (error) {
      console.error('Invalid URL:', url);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = existingImage;

    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      try {
        const uploadResponse = await axios.post('http://localhost:8080/learningPlan/planUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
        return;
      }
    }

    const updatedPost = { title, description, contentURL, tags, imageUrl, postOwnerID: localStorage.getItem('userID'), templateID, startDate, endDate, category };
    try {
      await axios.put(`http://localhost:8080/learningPlan/${id}`, updatedPost);
      alert('Post updated successfully!');
      window.location.href = '/allLearningPlan';
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await axios.delete(`http://localhost:8080/learningPlan/${id}`);
        alert('Learning plan deleted successfully!');
        navigate('/allLearningPlan');
      } catch (error) {
        console.error('Error deleting learning plan:', error);
        alert('Failed to delete learning plan.');
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
          <h1>Update Learning Plan</h1>
          <div className="header-actions">
            <FaEdit className="header-icon" />
            <RiDeleteBin6Fill 
              className="header-icon delete" 
              onClick={handleDelete}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form-new">
          <div className="form-columns">
            <div className="input-group">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

          <div className="profile-upload" onClick={() => document.querySelector('input[type="file"]').click()}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : existingImage ? (
              <img 
                src={`http://localhost:8080/learningPlan/planImages/${existingImage}`} 
                alt="Current" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <div className="upload-placeholder">Click to upload image</div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />

          <div className="input-group">
            <input
              type="url"
              placeholder="Content URL"
              value={contentURL}
              onChange={(e) => setContentURL(e.target.value)}
              required
            />
          </div>

          <div className="skills-container">
            <div className="skills-input-group">
              <input
                type="text"
                placeholder="Add tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <button type="button" className="add-skill-button" onClick={handleAddTag}>
                <IoMdAdd />
              </button>
            </div>
            <div className="skills-list">
              {tags.map((tag, index) => (
                <span key={index} className="skill-badge">
                  #{tag}
                  <span className="remove-skill" onClick={() => handleDeleteTag(index)}>×</span>
                </span>
              ))}
            </div>
          </div>

          <div className="input-group">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="form-columns">
            <div className="input-group">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <select
              value={templateID}
              onChange={(e) => setTemplateID(Number(e.target.value))}
              required
            >
              <option value="">Select Template</option>
              <option value="1">Template 1</option>
              <option value="2">Template 2</option>
              <option value="3">Template 3</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="register-button">
              Update Learning Plan
            </button>
          </div>
        </form>
      </div>

      <div className="template-preview-container">
        <div className={`template template-1 ${templateID === 1 ? 'selected' : ''}`}>
          <p className='template_id_one'>template 1</p>
          <p className='template_title'>{title || "Title Preview"}</p>
          <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
          <p className='template_description'>{category}</p>
          <hr></hr>
          <p className='template_description'>{description || "Description Preview"}</p>
          <div className="tags_preview">
            {tags.map((tag, index) => (
              <span key={index} className="tagname">#{tag}</span>
            ))}
          </div>
          {imagePreview ? (
            <div className="image-preview-achi">
              <img src={imagePreview} alt="Preview" className="iframe_preview" />
            </div>
          ) : existingImage && (
            <div className="image-preview-achi">
              <img src={`http://localhost:8080/learningPlan/planImages/${existingImage}`} alt="Existing" className="iframe_preview" />
            </div>
          )}
          {contentURL && (
            <iframe
              src={getEmbedURL(contentURL)}
              title="Content Preview"
              className="iframe_preview"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
        </div>
        <div className={`template template-2 ${templateID === 2 ? 'selected' : ''}`}>
          <p className='template_id_one'>template 2</p>
          <p className='template_title'>{title || "Title Preview"}</p>
          <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
          <p className='template_description'>{category}</p>
          <hr></hr>
          <p className='template_description'>{description || "Description Preview"}</p>
          <div className="tags_preview">
            {tags.map((tag, index) => (
              <span key={index} className="tagname">#{tag}</span>
            ))}
          </div>
          <div className='preview_part'>
            <div className='preview_part_sub'>
              {imagePreview ? (
                <div className="image-preview-achi">
                  <img src={imagePreview} alt="Preview" className="iframe_preview_new" />
                </div>
              ) : existingImage && (
                <div className="image-preview-achi">
                  <img src={`http://localhost:8080/learningPlan/planImages/${existingImage}`} alt="Existing" className="iframe_preview_new" />
                </div>
              )}
            </div>
            <div className='preview_part_sub'>
              {contentURL && (
                <iframe
                  src={getEmbedURL(contentURL)}
                  title="Content Preview"
                  className="iframe_preview_new"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
        <div className={`template template-3 ${templateID === 3 ? 'selected' : ''}`}>
          <p className='template_id_one'>template 3</p>
          {imagePreview ? (
            <div className="image-preview-achi">
              <img src={imagePreview} alt="Preview" className="iframe_preview" />
            </div>
          ) : existingImage && (
            <div className="image-preview-achi">
              <img src={`http://localhost:8080/learningPlan/planImages/${existingImage}`} alt="Existing" className="iframe_preview" />
            </div>
          )}
          {contentURL && (
            <iframe
              src={getEmbedURL(contentURL)}
              title="Content Preview"
              className="iframe_preview"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
          <p className='template_title'>{title || "Title Preview"}</p>
          <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
          <p className='template_description'>{category}</p>
          <hr></hr>
          <p className='template_description'>{description || "Description Preview"}</p>
          <div className="tags_preview">
            {tags.map((tag, index) => (
              <span key={index} className="tagname">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateLearningPost;