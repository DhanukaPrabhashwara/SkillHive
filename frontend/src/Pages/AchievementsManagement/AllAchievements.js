import React, { useEffect, useState } from 'react';
import { FaEdit, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import NavBar from '../../Components/NavBar/NavBar';
import { IoIosCreate } from 'react-icons/io';
import './Achievements.css';

function AllAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentInput, setCommentInput] = useState({});
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error('Error fetching Achievements data:', error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = progressData.filter(
      (achievement) =>
        achievement.title.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleLike = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/achievements/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        const updatedAchievement = await response.json();
        setFilteredData((prev) =>
          prev.map((item) => (item.id === id ? updatedAchievement : item))
        );
      }
    } catch (error) {
      console.error('Error liking achievement:', error);
    }
  };

  const handleComment = async (id) => {
    if (!commentInput[id]) return;
    try {
      const response = await fetch(`http://localhost:8080/achievements/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, comment: commentInput[id] }),
      });
      if (response.ok) {
        const updatedAchievement = await response.json();
        setFilteredData((prev) =>
          prev.map((item) => (item.id === id ? updatedAchievement : item))
        );
        setCommentInput((prev) => ({ ...prev, [id]: '' }));
      }
    } catch (error) {
      console.error('Error commenting on achievement:', error);
    }
  };

  const handleShare = (achievement) => {
    const shareData = {
      title: achievement.title,
      text: achievement.description,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Share feature not supported in this browser.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Achievement?')) {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Achievement deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        } else {
          alert('Failed to delete Achievement.');
        }
      } catch (error) {
        console.error('Error deleting Achievement:', error);
      }
    }
  };

  return (
    <div className="achievements-page">
      <NavBar />
      <div className="achievements-content">
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="achievements-grid">
          {filteredData.length === 0 ? (
            <div className="no-achievements">
              <h3>No Achievements Found</h3>
              <p>Share your accomplishments with the community</p>
              <button
                className="create-button"
                onClick={() => (window.location.href = '/addAchievements')}
              >
                Create Achievement
              </button>
            </div>
          ) : (
            filteredData.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                {achievement.imageUrl && (
                  <img
                    src={`http://localhost:8080/achievements/images/${achievement.imageUrl}`}
                    alt="Achievement"
                    className="achievement-image"
                  />
                )}
                <div className="achievement-content">
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                  <div className="achievement-meta">
                    <span className="achievement-owner">{achievement.postOwnerName}</span>
                    <span className="achievement-date">{achievement.date}</span>
                  </div>
                  <div className="achievement-badges">
                    {achievement.badges.map((badge) => (
                      <span key={badge} className="badge">{badge}</span>
                    ))}
                  </div>
                  <div className="achievement-interactions">
                    <button
                      className={`interaction-btn ${achievement.likes.includes(userId) ? 'liked' : ''}`}
                      onClick={() => handleLike(achievement.id)}
                    >
                      <FaHeart /> {achievement.likes.length}
                    </button>
                    <button className="interaction-btn" onClick={() => handleComment(achievement.id)}>
                      <FaComment /> {achievement.comments.length}
                    </button>
                    <button className="interaction-btn" onClick={() => handleShare(achievement)}>
                      <FaShare /> Share
                    </button>
                  </div>
                  <div className="comments-section">
                    <input
                      type="text"
                      className="comment-input"
                      placeholder="Add a comment..."
                      value={commentInput[achievement.id] || ''}
                      onChange={(e) =>
                        setCommentInput((prev) => ({ ...prev, [achievement.id]: e.target.value }))
                      }
                    />
                    <button
                      className="comment-submit"
                      onClick={() => handleComment(achievement.id)}
                      disabled={!commentInput[achievement.id]}
                    >
                      Post
                    </button>
                    {achievement.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <span className="comment-user">{comment.userId}</span>: {comment.comment}
                      </div>
                    ))}
                  </div>
                  {achievement.postOwnerID === userId && (
                    <div className="achievement-actions">
                      <FaEdit
                        onClick={() => (window.location.href = `/updateAchievements/${achievement.id}`)}
                        className="action-icon edit"
                      />
                      <RiDeleteBin6Fill
                        onClick={() => handleDelete(achievement.id)}
                        className="action-icon delete"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <button
          className="add-achievement-btn"
          onClick={() => (window.location.href = '/addAchievements')}
        >
          <IoIosCreate />
        </button>
      </div>
    </div>
  );
}

export default AllAchievements;