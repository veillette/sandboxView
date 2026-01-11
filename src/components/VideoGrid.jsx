import React, { memo } from 'react';

/**
 * VideoGrid Component
 *
 * Displays a scrollable grid of large, colorful video thumbnails.
 * Each thumbnail shows the video's emoji icon and title.
 * Designed for easy tapping by young children.
 */
const VideoGrid = memo(function VideoGrid({ videos, onVideoSelect, onSettingsClick }) {
  return (
    <div className="video-grid-container">
      {/* Header */}
      <header className="grid-header">
        <h1 className="grid-title">
          <span className="title-emoji">🎬</span>
          My Videos
        </h1>
        {/* Settings button - hidden in corner, requires parental gate */}
        <button
          className="settings-button"
          onClick={onSettingsClick}
          aria-label="Parent Settings"
        >
          ⚙️
        </button>
      </header>

      {/* Video Grid */}
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onSelect={() => onVideoSelect(video)}
          />
        ))}
      </div>
    </div>
  );
});

/**
 * VideoCard Component
 *
 * Individual video thumbnail card with emoji, title, and YouTube thumbnail.
 */
const VideoCard = memo(function VideoCard({ video, onSelect }) {
  // YouTube thumbnail URL (maxresdefault for best quality)
  const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;

  return (
    <button
      className="video-card"
      onClick={onSelect}
      style={{ '--card-color': video.color }}
      aria-label={`Play ${video.title}`}
    >
      {/* Thumbnail Image */}
      <div className="thumbnail-container">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="thumbnail-image"
          loading="lazy"
          onError={(e) => {
            // Fallback if thumbnail fails to load
            e.target.style.display = 'none';
          }}
        />
        {/* Play overlay */}
        <div className="play-overlay">
          <span className="play-icon">▶</span>
        </div>
      </div>

      {/* Video Info */}
      <div className="video-info">
        <span className="video-emoji">{video.emoji}</span>
        <span className="video-title">{video.title}</span>
      </div>
    </button>
  );
});

export default VideoGrid;
