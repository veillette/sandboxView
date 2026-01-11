import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import YouTube from 'react-youtube';

/**
 * VideoPlayer Component
 *
 * Full-screen YouTube video player with safety features:
 * - No related videos (rel=0)
 * - Modest branding (modestbranding=1)
 * - No annotations (iv_load_policy=3)
 * - Controlled playback
 * - Overlay to block YouTube logo clicks
 * - Large back button for easy navigation
 *
 * YouTube Player Parameters Reference:
 * https://developers.google.com/youtube/player_parameters
 */
const VideoPlayer = memo(function VideoPlayer({ video, onBack }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const playerRef = useRef(null);

  /**
   * YouTube Player Configuration
   *
   * These parameters create a "walled garden" experience:
   * - rel: 0 - Don't show related videos from other channels
   * - modestbranding: 1 - Minimal YouTube branding
   * - controls: 1 - Show playback controls (needed for kids)
   * - disablekb: 1 - Disable keyboard controls (prevents shortcuts)
   * - fs: 0 - Disable fullscreen button (we're already fullscreen)
   * - iv_load_policy: 3 - Hide video annotations
   * - playsinline: 1 - Play inline on mobile (iOS)
   * - showinfo: 0 - Hide video title/uploader (deprecated but still works)
   * - cc_load_policy: 0 - Don't force captions
   * - origin: window.location.origin - Security requirement
   */
  const playerOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      rel: 0,
      modestbranding: 1,
      controls: 1,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      playsinline: 1,
      showinfo: 0,
      cc_load_policy: 0,
      origin: typeof window !== 'undefined' ? window.location.origin : '',
      // Autoplay the video
      autoplay: 1,
      // Enable privacy-enhanced mode
      host: 'https://www.youtube-nocookie.com'
    }
  };

  // Handle player ready
  const handleReady = useCallback((event) => {
    playerRef.current = event.target;
    setIsLoading(false);
    // Start playing
    event.target.playVideo();
  }, []);

  // Handle player error
  const handleError = useCallback((event) => {
    console.error('YouTube Player Error:', event.data);
    setHasError(true);
    setIsLoading(false);
  }, []);

  // Handle video end - return to grid or replay
  const handleEnd = useCallback(() => {
    // Replay the video automatically (great for kids who love repetition)
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.stopVideo();
      }
    };
  }, []);

  // Prevent accidental touches from pausing
  const handleContainerClick = useCallback((e) => {
    // Only allow clicks on the back button
    if (!e.target.closest('.back-button')) {
      e.stopPropagation();
    }
  }, []);

  return (
    <div
      className="video-player-container"
      onClick={handleContainerClick}
      style={{ '--video-color': video.color }}
    >
      {/* Large Back Button */}
      <button
        className="back-button"
        onClick={onBack}
        aria-label="Go back to video list"
      >
        <span className="back-arrow">←</span>
        <span className="back-text">Back</span>
      </button>

      {/* Video Title */}
      <div className="player-title">
        <span className="player-emoji">{video.emoji}</span>
        <span className="player-video-title">{video.title}</span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="player-loading">
          <div className="loading-spinner" />
          <span className="loading-text">Loading video...</span>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="player-error">
          <span className="error-emoji">😢</span>
          <span className="error-text">Oops! Video unavailable</span>
          <button className="error-back-button" onClick={onBack}>
            Go Back
          </button>
        </div>
      )}

      {/* YouTube Player */}
      <div className="player-wrapper">
        <YouTube
          videoId={video.id}
          opts={playerOpts}
          onReady={handleReady}
          onError={handleError}
          onEnd={handleEnd}
          className="youtube-player"
          iframeClassName="youtube-iframe"
        />

        {/* Overlay to block YouTube logo and other clickable elements */}
        <div className="player-overlay-top" />
        <div className="player-overlay-bottom" />
      </div>
    </div>
  );
});

export default VideoPlayer;
