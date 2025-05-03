import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import { FaEdit, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import './Achievements.css';

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
    imageUrl: '',
    likes: [],
    comments: [],
    badges: [],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const userId = localStorage.getItem('userID');

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8080/achievements/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        const updatedAchievement = await response.json();
        setFormData(updatedAchievement);
      }
    } catch (error) {
      console.error('Error liking achievement:', error);
    }
  };

  const handleComment = async () => {
    if (!commentInput) return;
    try {
      const response = await fetch(`http://localhost:8080/achievements/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, comment: commentInput }),
      });
      if (response.ok) {
        const updatedAchievement = await response.json();
        setFormData(updatedAchievement);
        setCommentInput('');
      }
    } catch (error) {
      console.error('Error commenting on achievement:', error);
    }
  };

  const handleShare = () => {
    const shareData = {
      title: formData.title,
      text: formData.description,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Share feature not supported in this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.imageUrl;
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

      const updatedData = { ...formData, imageUrl };
      const response = await fetch(`http://localhost:8080/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Achievement updated successfully!');
        navigate('/allAchievements');
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
          method: 'DELETE',
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
    <div className="achievements-page">
      <NavBar />
      <div className="achievements-content">
        <div className="achievement-card">
          <div className="achievement-header">
            <h1>Update Achievement</h1>
            <div className="header-actions">
              <FaEdit className="action-icon edit" />
              <RiDeleteBin6Fill className="action-icon delete" onClick={handleDelete} />
            </div>
            <p>Edit your achievement details</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Upload Image</label>
              {previewImage && (
                <div className="image-preview">
                  <img src={previewImage} alt="Achievement" />
                </div>
              )}
              <div className="file-input-container">
                <input
                  type="file"
                  className="custom-file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="Achievement Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                className="form-input"
                placeholder="Describe your achievement"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="form-input"
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

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Achievement'}
            </button>
          </form>

          <div className="achievement-interactions">
            <button
              className={`interaction-btn ${formData.likes.includes(userId) ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <FaHeart /> {formData.likes.length}
            </button>
            <button className="interaction-btn" onClick={handleComment}>
              <FaComment /> {formData.comments.length}
            </button>
            <button className="interaction-btn" onClick={handleShare}>
              <FaShare /> Share
            </button>
          </div>

          <div className="comments-section">
            <input
              type="text"
              className="comment-input"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              className="comment-submit"
              onClick={handleComment}
              disabled={!commentInput}
            >
              Post
            </button>
            {formData.comments.map((comment, index) => (
              <div key={index} className="comment">
                <span className="comment-user">{comment.userId}</span>: {comment.comment}
              </div>
            ))}
          </div>

          <div className="achievement-badges">
            {formData.badges.map((badge) => (
              <span key={badge} className="badge">{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateAchievements;