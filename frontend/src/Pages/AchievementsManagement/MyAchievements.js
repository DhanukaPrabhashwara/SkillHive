import React, { useEffect, useState } from 'react';
import { FaEdit, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import NavBar from '../../Components/NavBar/NavBar';
import { IoIosCreate } from 'react-icons/io';
import './Achievements.css';

function MyAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [commentInput, setCommentInput] = useState({});
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        const userFilteredData = data.filter((achievement) => achievement.postOwnerID === userId);
        setProgressData(userFilteredData);
        setFilteredData(userFilteredData);
      })
      .catch((error) => console.error('Error fetching Achievements data:', error));
  }, []);

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
        <div className="register-header">
          <h1>My Achievements</h1>
          <p>View and manage your achievements</p>
        </div>

        <div className="achievements-grid">
          {filteredData.length === 0 ? (
            <div className="no-achievements">
              <h3>No Achievements Found</h3>
              <p>Share your first achievement with the community</p>
              <button
                className="create-button"
                onClick={() => (window.location.href = '/addAchievements')}
              >
                Create Achievement
              </button>
            </div>
          ) : (
            filteredData.map((progress) => (
              <div key={progress.id} className="achievement-card">
                <div className="user_details_card">
                  <div className="name_section_post_achi">
                    <p className="name_section_post_owner_name">{progress.postOwnerName}</p>
                    <p className="date_card_dte">{progress.date}</p>
                  </div>
                  <div className="achievement-actions">
                    <FaEdit
                      onClick={() => (window.location.href = `/updateAchievements/${progress.id}`)}
                      className="action-icon edit"
                    />
                    <RiDeleteBin6Fill
                      onClick={() => handleDelete(progress.id)}
                      className="action-icon delete"
                    />
                  </div>
                </div>
                <div className="dis_con">
                  <p className="topic_cont">{progress.title}</p>
                  <p className="dis_con_pera" style={{ whiteSpace: 'pre-line' }}>
                    {progress.description}
                  </p>
                  {progress.imageUrl && (
                    <img
                      src={`http://localhost:8080/achievements/images/${progress.imageUrl}`}
                      alt="Achievement"
                      className="achievement-image"
                    />
                  )}
                  <div className="achievement-badges">
                    {progress.badges.map((badge) => (
                      <span key={badge} className="badge">{badge}</span>
                    ))}
                  </div>
                  <div className="achievement-interactions">
                    <button
                      className={`interaction-btn ${progress.likes.includes(userId) ? 'liked' : ''}`}
                      onClick={() => handleLike(progress.id)}
                    >
                      <FaHeart /> {progress.likes.length}
                    </button>
                    <button className="interaction-btn" onClick={() => handleComment(progress.id)}>
                      <FaComment /> {progress.comments.length}
                    </button>
                    <button className="interaction-btn" onClick={() => handleShare(progress)}>
                      <FaShare /> Share
                    </button>
                  </div>
                  <div className="comments-section">
                    <input
                      type="text"
                      className="comment-input"
                      placeholder="Add a comment..."
                      value={commentInput[progress.id] || ''}
                      onChange={(e) =>
                        setCommentInput((prev) => ({ ...prev, [progress.id]: e.target.value }))
                      }
                    />
                    <button
                      className="comment-submit"
                      onClick={() => handleComment(progress.id)}
                      disabled={!commentInput[progress.id]}
                    >
                      Post
                    </button>
                    {progress.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <span className="comment-user">{comment.userId}</span>: {comment.comment}
                      </div>
                    ))}
                  </div>
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

export default MyAchievements;