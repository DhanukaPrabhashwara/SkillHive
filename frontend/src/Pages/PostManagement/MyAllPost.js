import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUploadCloud } from 'react-icons/fi';
import { FaRegHeart, FaHeart, FaRegComment, FaEdit, FaTrash } from 'react-icons/fa';
import NavBar from '../../Components/NavBar/NavBar';
import Modal from 'react-modal';
import './MyPost.css';

Modal.setAppElement('#root');

function MyAllPost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postOwners, setPostOwners] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const loggedInUserID = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/posts');
        const userID = localStorage.getItem('userID');
        const userPosts = response.data.filter((post) => post.userID === userID);

        setPosts(userPosts);
        setFilteredPosts(userPosts);

        const userIDs = [...new Set(userPosts.map((post) => post.userID))];
        const ownerPromises = userIDs.map((userID) =>
          axios.get(`http://localhost:8080/user/${userID}`)
            .then((res) => ({
              userID,
              fullName: res.data.fullname,
            }))
            .catch((error) => {
              console.error(`Error fetching user details for userID ${userID}:`, error);
              return { userID, fullName: 'Anonymous' };
            })
        );
        const owners = await Promise.all(ownerPromises);
        const ownerMap = owners.reduce((acc, owner) => {
          acc[owner.userID] = owner.fullName;
          return acc;
        }, {});
        setPostOwners(ownerMap);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${postId}`);
      alert('Post deleted successfully!');
      setPosts(posts.filter((post) => post.id !== postId));
      setFilteredPosts(filteredPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/updatePost/${postId}`);
  };

  const handleLike = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to like a post.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/posts/${postId}/like`, null, {
        params: { userID },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        (post.category && post.category.toLowerCase().includes(query))
    );
    setFilteredPosts(filtered);
  };

  const openModal = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setIsModalOpen(false);
  };

  return (
    <div className="my-posts-page">
      <NavBar />
      <div className="my-posts-container">
        <div className="posts-header">
          <h1>My Posts</h1>
          <div className="header-controls">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            <button 
              className="new-post-button"
              onClick={() => navigate('/addNewPost')}
            >
              Create Post
            </button>
          </div>
        </div>

        <div className="posts-grid">
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <FiUploadCloud size={48} />
              <h3>No Posts Yet</h3>
              <p>Share your first post with the community</p>
              <button className="new-post-button" onClick={() => navigate('/addNewPost')}>
                Create Post
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-avatar">
                      {postOwners[post.userID]?.[0] || 'A'}
                    </div>
                    <div className="author-info">
                      <h3>{postOwners[post.userID] || 'Anonymous'}</h3>
                      <span>{post.category || 'Uncategorized'}</span>
                    </div>
                  </div>
                  <div className="post-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleUpdate(post.id)}
                    >
                      <FaEdit className="action-icon" />
                      <span>Update</span>
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(post.id)}
                    >
                      <FaTrash className="action-icon" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                <div className="post-content">
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                </div>

                {post.media && post.media.length > 0 && (
                  <div className={`media-grid media-count-${Math.min(post.media.length, 4)}`}>
                    {post.media.slice(0, 4).map((url, index) => (
                      <div 
                        key={index}
                        className="media-item"
                        onClick={() => openModal(url)}
                      >
                        {url.endsWith('.mp4') ? (
                          <div className="video-preview">
                            <video>
                              <source src={`http://localhost:8080${url}`} type="video/mp4" />
                            </video>
                            <div className="video-indicator">▶</div>
                          </div>
                        ) : (
                          <img 
                            src={`http://localhost:8080${url}`} 
                            alt={`Post media ${index + 1}`}
                          />
                        )}
                        {post.media.length > 4 && index === 3 && (
                          <div className="more-overlay">
                            +{post.media.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="post-interactions">
                  <button 
                    className={`like-button ${post.likes?.[loggedInUserID] ? 'active' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    {post.likes?.[loggedInUserID] ? <FaHeart /> : <FaRegHeart />}
                    <span>{Object.values(post.likes || {}).filter(Boolean).length}</span>
                  </button>
                  <button className="comment-button">
                    <FaRegComment />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="media-modal"
        overlayClassName="media-modal-overlay"
      >
        <button className="close-modal-btn" onClick={closeModal}>x</button>
        {selectedMedia && selectedMedia.endsWith('.mp4') ? (
          <video controls className="modal-media">
            <source src={`http://localhost:8080${selectedMedia}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={`http://localhost:8080${selectedMedia}`} alt="Full Media" className="modal-media" />
        )}
      </Modal>
    </div>
  );
}

export default MyAllPost;
