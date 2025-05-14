import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import { FiUploadCloud } from 'react-icons/fi';
import './AddPost.css';

function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [categories, setCategories] = useState('');
  const userID = localStorage.getItem('userID');

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024;

    let imageCount = 0;
    let videoCount = 0;
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        window.location.reload();
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
      } else if (file.type === 'video/mp4') {
        videoCount++;

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
            window.location.reload();
          }
        };
      } else {
        alert(`Unsupported file type: ${file.type}`);
        window.location.reload();
      }

      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    if (imageCount > 3) {
      alert('You can upload a maximum of 3 images.');
      window.location.reload();
    }

    if (videoCount > 1) {
      alert('You can upload only 1 video.');
      window.location.reload();
    }

    setMedia(files);
    setMediaPreviews(previews);
  };

  const removeMedia = (index) => {
    const newMedia = [...media];
    const newPreviews = [...mediaPreviews];
    newMedia.splice(index, 1);
    newPreviews.splice(index, 1);
    setMedia(newMedia);
    setMediaPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', categories);
    media.forEach((file, index) => formData.append(`mediaFiles`, file));

    try {
      const response = await axios.post('http://localhost:8080/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post created successfully!');
      window.location.href = '/myAllPost';
    } catch (error) {
      console.error(error);
      alert('Failed to create post.');
      window.location.reload();
    }
  };

  return (
    <div className="add-post-page">
      <NavBar />
      <div className="add-post-container">
        <div className="add-post-card">
          <div className="add-post-header">
            <h1>Create New Post</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input"
                placeholder="Enter post description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="form-input category-select"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
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

            <div className="form-group">
              <label>Media Files</label>
              <div className="media-upload-container">
                <input
                  type="file"
                  id="file-input"
                  className="custom-file-input"
                  accept="image/jpeg,image/png,image/jpg,video/mp4"
                  multiple
                  onChange={handleMediaChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                  <FiUploadCloud className="upload-icon" />
                  <div className="upload-text">
                    <strong>Click to upload</strong> or drag and drop
                    <div className="upload-limit-info">
                      Supported formats: JPEG, PNG, MP4 
                      <br />
                      Max: 3 images, 1 video (30s)
                    </div>
                  </div>
                </label>
              </div>

              {mediaPreviews.length > 0 && (
                <div className="media-preview">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="media-item">
                      {preview.type.startsWith('video/') ? (
                        <>
                          <video>
                            <source src={preview.url} type={preview.type} />
                          </video>
                          <span className="file-type-badge">Video</span>
                        </>
                      ) : (
                        <>
                          <img src={preview.url} alt={`Preview ${index}`} />
                          <span className="file-type-badge">Image</span>
                        </>
                      )}
                      <button 
                        className="media-remove" 
                        onClick={() => removeMedia(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="submit-button">
              Create Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;
