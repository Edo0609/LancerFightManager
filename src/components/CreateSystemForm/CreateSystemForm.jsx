import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import './CreateSystemForm.css';

const CreateSystemForm = ({ onClose, onSystemCreated }) => {
  const { saveSystem } = useDatabase();
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Tags: []
  });
  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagInputChange = (e) => {
    setCurrentTag(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.Tags.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          Tags: [...prev.Tags, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      Tags: prev.Tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const systemId = await saveSystem(formData);
      onSystemCreated({ ...formData, id: systemId });
      onClose();
    } catch (error) {
      console.error('Error saving system:', error);
    }
  };

  return (
    <div className="system-form-overlay">
      <div className="system-form-content">
        <div className="system-form-header">
          <h2>Create New System</h2>
          <button className="system-form-close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="system-form">
          <div className="system-form-group">
            <label htmlFor="Name">System Name</label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              required
              placeholder="Enter system name"
            />
          </div>

          <div className="system-form-group">
            <label htmlFor="Description">Description</label>
            <textarea
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Enter system description"
            />
          </div>

          <div className="system-form-group">
            <label htmlFor="tags">Tags</label>
            <div className="system-form-tags-input-container">
              <input
                type="text"
                id="tags"
                value={currentTag}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
              />
              <div className="system-form-tags-list">
                {formData.Tags.map((tag, index) => (
                  <span key={index} className="system-form-tag">
                    {tag}
                    <button
                      type="button"
                      className="system-form-remove-tag"
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="system-form-actions">
            <button type="button" className="system-form-cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="system-form-submit-button">
              Create System
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSystemForm; 