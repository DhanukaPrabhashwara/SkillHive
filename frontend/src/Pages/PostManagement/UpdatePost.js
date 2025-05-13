import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import { FiUploadCloud } from 'react-icons/fi';
import './AddPost.css';

function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [existingMedia, setExistingMedia] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${id}`);
        const post = response.data;
        setTitle(post.title || '');
        setDescription(post.description || '');
        setCategory(post.category || '');
        setExistingMedia(post.media || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Failed to fetch post details.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDeleteMedia = async (mediaUrl) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media file?');
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${id}/media`, {
        data: { mediaUrl },
      });
      setExistingMedia(existingMedia.filter((url) => url !== mediaUrl));
      alert('Media file deleted successfully!');
    } catch (error) {
      console.error('Error deleting media file:', error);
      alert('Failed to delete media file.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:8080/posts/${id}`);
        alert('Post deleted successfully!');
        navigate('/allPost');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        reject(`Failed to load video metadata for ${file.name}.`);
      };
    });
  };

  const handleNewMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024;
    const maxImageCount = 3;

    let imageCount = existingMedia.filter((url) => !url.endsWith('.mp4')).length;
    let videoCount = existingMedia.filter((url) => url.endsWith('.mp4')).length;

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
        if (imageCount > maxImageCount) {
          alert('You can upload a maximum of 3 images.');
          return;
        }
      } else if (file.type === 'video/mp4') {
        videoCount++;
        if (videoCount > 1) {
          alert('You can upload only 1 video.');
          return;
        }

        try {
          await validateVideoDuration(file);
        } catch (error) {
          alert(error);
          return;
        }
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }
    }

    setNewMedia(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    newMedia.forEach((file) => formData.append('newMediaFiles', file));

    try {
      await axios.put(`http://localhost:8080/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post updated successfully!');
      navigate('/allPost');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-post-page">
      <NavBar />
      <div className="add-post-container">
        <div className="add-post-card">
          <div className="add-post-header">
            <h1>Update Post</h1>
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

            <div className="form-group">
              <label>Media Files</label>
              <div className="media-upload-container">
                <input
                  type="file"
                  id="file-input"
                  className="custom-file-input"
                  accept="image/jpeg,image/png,image/jpg,video/mp4"
                  multiple
                  onChange={handleNewMediaChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                  <FiUploadCloud className="upload-icon" />
                  <div className="upload-text">
                    <strong>Click to upload new files</strong> or drag and drop
                    <div className="upload-limit-info">
                      Supported formats: JPEG, PNG, MP4 
                      <br />
                      Max: 3 images, 1 video (30s)
                    </div>
                  </div>
                </label>
              </div>

              {existingMedia.length > 0 && (
                <div className="media-preview">
                  {existingMedia.map((mediaUrl, index) => (
                    <div key={index} className="media-item">
                      {mediaUrl.endsWith('.mp4') ? (
                        <>
                          <video controls>
                            <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                          </video>
                          <span className="file-type-badge">Video</span>
                        </>
                      ) : (
                        <>
                          <img src={`http://localhost:8080${mediaUrl}`} alt={`Media ${index}`} />
                          <span className="file-type-badge">Image</span>
                        </>
                      )}
                      <button
                        className="media-remove"
                        onClick={() => handleDeleteMedia(mediaUrl)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Updating...' : 'Update Post'}
              </button>
              <button 
                type="button" 
                className="delete-button"
                onClick={handleDelete}
              >
                Delete Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;
