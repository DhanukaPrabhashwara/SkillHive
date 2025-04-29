import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './achieve.css';

function AddAchievements() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    postOwnerID: '',
    category: '',
    postOwnerName: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      setFormData((prevData) => ({ ...prevData, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.fullname) {
            setFormData((prevData) => ({ ...prevData, postOwnerName: data.fullname }));
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append('file', image);
        const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
          method: 'POST',
          body: imageFormData,
        });
        imageUrl = await uploadResponse.text();
      }

      const response = await fetch('http://localhost:8080/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrl }),
      });

      if (response.ok) {
        toast.success('Achievement added successfully!');
        window.location.href = '/myAchievements';
        setFormData({
          title: '',
          description: '',
          date: '',
          category: '',
          postOwnerID: formData.postOwnerID,
          postOwnerName: formData.postOwnerName,
        });
        setImage(null);
        setImagePreview(null);
      } else {
        throw new Error('Failed to add achievement');
      }
    } catch (error) {
      toast.error('Failed to add achievement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="continer">
      <NavBar />
      <div className="continSection">
        <div className="from_continer">
          <p className="Auth_heading">Add Achievement</p>
          <form
            onSubmit={handleSubmit}
            className="from_data"
          >
            <div className="Auth_formGroup">
              <label className="Auth_label">Upload Image</label>
              <div
                className={`image-upload-container ${isDragging ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview-achi" />
                ) : (
                  <p>Drag & Drop or Click to Upload (PNG, JPG)</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="Auth_input"
                  style={{ display: imagePreview ? 'none' : 'block' }}
                />
                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
              </div>
            </div>
            <div className="Auth_formGroup">
              <label className="Auth_label">Title</label>
              <input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="Auth_input"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            <div className="Auth_formGroup">
              <label className="Auth_label">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="Auth_input"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div className="Auth_formGroup">
              <label className="Auth_label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="Auth_input"
              >
                <option value="" disabled>Select Category</option>
                <option value="Tech">Tech</option>
                <option value="Programming">Programming</option>
                <option value="Cooking">Cooking</option>
                <option value="Photography">Photography</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>
            <div className="Auth_formGroup">
              <label className="Auth_label">Date</label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="Auth_input"
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>
            <button type="submit" className="Auth_button" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : 'Add Achievement'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAchievements;