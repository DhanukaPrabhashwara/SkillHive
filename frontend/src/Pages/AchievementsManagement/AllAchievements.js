import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { IoIosCreate } from 'react-icons/io';
import { FaEdit } from 'react-icons/fa';
import NavBar from '../../Components/NavBar/NavBar';
import { toast } from 'react-toastify';
import './achieve.css';

function AllAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
        setFilteredData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching Achievements data:', error);
        toast.error('Failed to load achievements.');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = progressData;
    if (searchQuery) {
      filtered = filtered.filter(
        (achievement) =>
          achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter((achievement) => achievement.category === categoryFilter);
    }
    setFilteredData(filtered);
  }, [searchQuery, categoryFilter, progressData]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast.success('Achievement deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        } else {
          toast.error('Failed to delete achievement.');
        }
      } catch (error) {
        console.error('Error deleting Achievement:', error);
        toast.error('Error deleting achievement.');
      }
    }
  };

  return (
    <div className="continer">
      <NavBar />
      <div className="continSection">
        <div className="search-filter-container">
          <div className="searchinput">
            <input
              type="text"
              placeholder="Search by title or description"
              value={searchQuery}
              onChange={handleSearch}
              className="Auth_input"
            />
          </div>
          <div className="category-filter">
            <select value={categoryFilter} onChange={handleCategoryFilter} className="Auth_input">
              <option value="">All Categories</option>
              <option value="Tech">Tech</option>
              <option value="Programming">Programming</option>
              <option value="Cooking">Cooking</option>
              <option value="Photography">Photography</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <div className="spinner"></div>
        ) : filteredData.length === 0 ? (
          <div className="not_found_box">
            <div className="not_found_img"></div>
            <p className="not_found_msg">No achievements found. Please create a new achievement.</p>
            <button
              className="not_found_btn"
              onClick={() => (window.location.href = '/addAchievements')}
            >
              Create New Achievement
            </button>
          </div>
        ) : (
          <div className="post_card_continer">
            {filteredData.map((progress) => (
              <div key={progress.id} className="post_card">
                <div className="user_details_card">
                  <div className="name_section_post_achi">
                    <p className="name_section_post_owner_name">{progress.postOwnerName}</p>
                    <p className="date_card_dte">{progress.date}</p>
                  </div>
                  {progress.postOwnerID === userId && (
                    <div className="action_btn_icon_post">
                      <FaEdit
                        onClick={() => (window.location.href = `/updateAchievements/${progress.id}`)}
                        className="action_btn_icon"
                      />
                      <RiDeleteBin6Fill
                        onClick={() => handleDelete(progress.id)}
                        className="action_btn_icon"
                      />
                    </div>
                  )}
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
                      className="achievement_image"
                    />
                  )}
                  <p className="text-sm text-purple-600 mt-2">{progress.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div
          className="add_new_btn"
          onClick={() => (window.location.href = '/addAchievements')}
        >
          <IoIosCreate className="add_new_btn_icon" />
        </div>
      </div>
    </div>
  );
}

export default AllAchievements;