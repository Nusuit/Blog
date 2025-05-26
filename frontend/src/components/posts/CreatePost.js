import React, { useState } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { useUser } from '../../contexts/UserContext';
import '../../styles/components/posts/CreatePost.css';

const CreatePost = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  const { addPost } = usePosts();
  const { userProfile } = useUser(); // Lấy thông tin user hiện tại
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const analyzeTopic = (content) => {
    const topics = {
      Technology: ['code', 'programming', 'tech', 'software', 'web', 'app', 'react', 'javascript'],
      Pets: ['pet', 'dog', 'cat', 'animal', 'puppy', 'kitten'],
      Lifestyle: ['life', 'lifestyle', 'daily', 'routine', 'personal'],
      Food: ['food', 'cook', 'recipe', 'meal', 'restaurant', 'eat'],
      Sports: ['sport', 'football', 'basketball', 'game', 'match', 'play']
    };

    const words = content.toLowerCase().split(' ');
    let topicCounts = {};

    words.forEach(word => {
      for (let [topic, keywords] of Object.entries(topics)) {
        if (keywords.some(keyword => word.includes(keyword))) {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        }
      }
    });

    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'General';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const topic = analyzeTopic(formData.content + ' ' + formData.title);
    
    const newPost = {
      ...formData,
      author: userProfile?.name || 'Anonymous',
      authorId: userProfile?.userId,
      avatar: userProfile?.avatar,
      createdAt: new Date().toISOString(),
      topic,
      likes: 0,
      comments: 0,
      preview: formData.content.substring(0, 150) + "..."
    };
    
    await addPost(newPost);
    onClose();
};

  return (
    <div className="create-post-overlay">
      <div className="create-post-modal">
        <div className="modal-header">
          <h2>Create Post</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter your title"
                required
              />
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="What's on your mind?"
                required
              />
            </div>

            <div className="form-group">
              <label>Image (Optional)</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;