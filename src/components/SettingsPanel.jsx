import React, { useState, useCallback, memo } from 'react';

/**
 * SettingsPanel Component
 *
 * Parent settings panel for managing the video library.
 * Only accessible after passing the parental gate.
 */
const SettingsPanel = memo(function SettingsPanel({
  videos,
  onClose,
  onAddVideo,
  onRemoveVideo,
  onResetVideos
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVideoId, setNewVideoId] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoEmoji, setNewVideoEmoji] = useState('🎵');
  const [error, setError] = useState('');

  // Available emojis for selection
  const emojis = ['🎵', '🎬', '🎪', '🎨', '🎭', '🦁', '🐻', '🦄', '🌈', '⭐', '🚀', '🎸'];

  // Available colors for selection
  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
    '#A78BFA', '#67B7DC', '#FDCB6E', '#FF85A2',
    '#B2F2BB', '#C4B5FD', '#F9A826', '#FF9FF3'
  ];

  const [selectedColor, setSelectedColor] = useState(colors[0]);

  // Extract YouTube video ID from URL or ID
  const extractVideoId = useCallback((input) => {
    // If it's already an ID (11 characters, alphanumeric + _ -)
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
      return input;
    }

    // Try to extract from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }, []);

  // Handle adding a new video
  const handleAddVideo = useCallback(
    (e) => {
      e.preventDefault();
      setError('');

      const videoId = extractVideoId(newVideoId.trim());

      if (!videoId) {
        setError('Invalid YouTube video ID or URL');
        return;
      }

      if (!newVideoTitle.trim()) {
        setError('Please enter a title');
        return;
      }

      // Check if video already exists
      if (videos.some((v) => v.id === videoId)) {
        setError('This video is already in the library');
        return;
      }

      onAddVideo({
        id: videoId,
        title: newVideoTitle.trim(),
        emoji: newVideoEmoji,
        color: selectedColor
      });

      // Reset form
      setNewVideoId('');
      setNewVideoTitle('');
      setShowAddForm(false);
    },
    [newVideoId, newVideoTitle, newVideoEmoji, selectedColor, videos, extractVideoId, onAddVideo]
  );

  return (
    <div className="settings-container">
      {/* Header */}
      <header className="settings-header">
        <button className="settings-back-btn" onClick={onClose}>
          ← Back
        </button>
        <h1 className="settings-title">
          <span>⚙️</span> Parent Settings
        </h1>
      </header>

      {/* Actions */}
      <div className="settings-actions">
        <button
          className="action-btn add-btn"
          onClick={() => setShowAddForm(true)}
        >
          ➕ Add Video
        </button>
        <button className="action-btn reset-btn" onClick={onResetVideos}>
          🔄 Reset to Defaults
        </button>
      </div>

      {/* Add Video Form */}
      {showAddForm && (
        <div className="add-form-overlay">
          <form className="add-form" onSubmit={handleAddVideo}>
            <h3 className="form-title">Add New Video</h3>

            <label className="form-label">
              YouTube Video ID or URL
              <input
                type="text"
                value={newVideoId}
                onChange={(e) => setNewVideoId(e.target.value)}
                placeholder="e.g., dQw4w9WgXcQ or full YouTube URL"
                className="form-input"
              />
            </label>

            <label className="form-label">
              Video Title (for child to see)
              <input
                type="text"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder="e.g., Fun Dance Song"
                className="form-input"
                maxLength={30}
              />
            </label>

            <div className="form-label">
              Choose Emoji
              <div className="emoji-picker">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`emoji-btn ${newVideoEmoji === emoji ? 'selected' : ''}`}
                    onClick={() => setNewVideoEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-label">
              Choose Color
              <div className="color-picker">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="form-buttons">
              <button
                type="button"
                className="form-cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setError('');
                }}
              >
                Cancel
              </button>
              <button type="submit" className="form-submit-btn">
                Add Video
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Video List */}
      <div className="video-list">
        <h2 className="list-title">Video Library ({videos.length} videos)</h2>
        {videos.map((video) => (
          <div
            key={video.id}
            className="video-item"
            style={{ '--item-color': video.color }}
          >
            <img
              src={`https://img.youtube.com/vi/${video.id}/default.jpg`}
              alt={video.title}
              className="item-thumbnail"
            />
            <div className="item-info">
              <span className="item-emoji">{video.emoji}</span>
              <span className="item-title">{video.title}</span>
              <span className="item-id">{video.id}</span>
            </div>
            <button
              className="item-delete-btn"
              onClick={() => onRemoveVideo(video.id)}
              aria-label={`Remove ${video.title}`}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="settings-info">
        <h3>📖 How to Add Videos</h3>
        <ol>
          <li>Find a child-appropriate YouTube video</li>
          <li>Copy the video URL or ID</li>
          <li>Click "Add Video" and paste it</li>
          <li>Give it a simple title your child will recognize</li>
        </ol>

        <h3>🔒 Safety Tips</h3>
        <ul>
          <li>Always preview videos before adding them</li>
          <li>Use iOS Guided Access or Android App Pinning for extra safety</li>
          <li>Videos are stored locally on this device</li>
        </ul>
      </div>
    </div>
  );
});

export default SettingsPanel;
