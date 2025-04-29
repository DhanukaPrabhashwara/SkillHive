import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import { toast } from 'react-toastify';
import './achieve.css';

function UpdateAchievements() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    postOwnerID: '',
    postOwnerName: '',
    imageUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`);
        if (!response.ok) throw new Error('Failed to fetch achievement');
        const data = await response.json();
        setFormData(data);
        if (data.imageUrl) {
          setPreviewImage(`http://localhost:8080/achievements/images/${data.imageUrl}`);
        }
      } catch (error) {
        console.error('Error fetching Achievements data:', error);
        toast.error('Error loading achievement data');
      }
    };
    fetchAchievement();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
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
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        if (!uploadResponse.ok) throw new Error('Image upload failed');
        imageUrl = await uploadResponse.text();
      }

      const updatedData = { ...formData, imageUrl };
      const response = await fetch(`http://localhost:8080/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        toast.success('Achievement updated successfully!');
        window.location.href = '/allAchievements';
      } else {
        throw new Error('Failed to update achievement');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error updating achievement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="continer">
      <NavBar />
      <div className="continSection">
        <div className="from_continer">
          <p className="Auth_heading">Update Achievement</p>
          <form onSubmit={handleSubmit} className="from_data">
            <div className="Auth_formGroup">
              <label className="Auth_label">Current Image</label>
              <div
                className={`image-upload-container ${isDragging ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="image-preview-achi" />
                ) : (
                  <p>Drag & Drop or Click to Upload (PNG, JPG)</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="Auth_input"
                  style={{ display: previewImage ? 'none' : 'block' }}
                />
              </div>
            </div>
            <div className="Auth_formGroup">
              <label className="Auth_label">Title</label>
              <input
                name="title"
                placeholder="Enter achievement title"
                value={formData.title}
                onChange={handleInputChange}
                className="Auth_input"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            <div className="Auth_formGroup">
              <label className="Auth_label">Description</label>
              <textarea
                name="description"
                placeholder="Describe your achievement"
                value={formData.description}
                onChange={handleInputChange}
                className="Auth_input"
                rows="5"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div className="Auth_formGroup">
              <label className="Auth_label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="Auth_input"
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>
            <button type="submit" className="Auth_button" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : 'Update Achievement'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateAchievements;