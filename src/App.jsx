import React, { useState, useCallback, useEffect } from 'react';
import VideoGrid from './components/VideoGrid';
import VideoPlayer from './components/VideoPlayer';
import ParentalGate from './components/ParentalGate';
import SettingsPanel from './components/SettingsPanel';
import videos from './data/videos.json';

/**
 * Kids Video Player - A "Walled Garden" Video App
 *
 * This app provides a safe, restricted environment for young children
 * to watch pre-approved YouTube videos without access to search,
 * recommendations, comments, or any external links.
 */
function App() {
  // Current view state: 'grid', 'player', or 'settings'
  const [currentView, setCurrentView] = useState('grid');

  // Currently selected video for playback
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Parental gate state
  const [showParentalGate, setShowParentalGate] = useState(false);

  // Video library (can be extended via settings)
  const [videoLibrary, setVideoLibrary] = useState(() => {
    // Try to load custom videos from localStorage
    const saved = localStorage.getItem('kidsVideoLibrary');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return videos;
      }
    }
    return videos;
  });

  // Save video library changes
  useEffect(() => {
    localStorage.setItem('kidsVideoLibrary', JSON.stringify(videoLibrary));
  }, [videoLibrary]);

  // Handle video selection from the grid
  const handleVideoSelect = useCallback((video) => {
    setSelectedVideo(video);
    setCurrentView('player');
  }, []);

  // Handle returning to the grid from the player
  const handleBackToGrid = useCallback(() => {
    setSelectedVideo(null);
    setCurrentView('grid');
  }, []);

  // Handle settings button (requires parental gate)
  const handleSettingsRequest = useCallback(() => {
    setShowParentalGate(true);
  }, []);

  // Handle successful parental gate unlock
  const handleParentalGateSuccess = useCallback(() => {
    setShowParentalGate(false);
    setCurrentView('settings');
  }, []);

  // Handle parental gate cancel
  const handleParentalGateCancel = useCallback(() => {
    setShowParentalGate(false);
  }, []);

  // Handle settings close
  const handleSettingsClose = useCallback(() => {
    setCurrentView('grid');
  }, []);

  // Handle adding a new video
  const handleAddVideo = useCallback((newVideo) => {
    setVideoLibrary((prev) => [...prev, newVideo]);
  }, []);

  // Handle removing a video
  const handleRemoveVideo = useCallback((videoId) => {
    setVideoLibrary((prev) => prev.filter((v) => v.id !== videoId));
  }, []);

  // Handle resetting to default videos
  const handleResetVideos = useCallback(() => {
    setVideoLibrary(videos);
  }, []);

  // Prevent back button and navigation
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      // If in player, go back to grid
      if (currentView === 'player') {
        handleBackToGrid();
      }
      // Push a new state to prevent leaving
      window.history.pushState(null, '', window.location.href);
    };

    // Push initial state
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentView, handleBackToGrid]);

  // Prevent leaving via beforeunload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="app">
      {/* Parental Gate Overlay */}
      {showParentalGate && (
        <ParentalGate
          onSuccess={handleParentalGateSuccess}
          onCancel={handleParentalGateCancel}
        />
      )}

      {/* Main Content */}
      {currentView === 'grid' && (
        <VideoGrid
          videos={videoLibrary}
          onVideoSelect={handleVideoSelect}
          onSettingsClick={handleSettingsRequest}
        />
      )}

      {currentView === 'player' && selectedVideo && (
        <VideoPlayer video={selectedVideo} onBack={handleBackToGrid} />
      )}

      {currentView === 'settings' && (
        <SettingsPanel
          videos={videoLibrary}
          onClose={handleSettingsClose}
          onAddVideo={handleAddVideo}
          onRemoveVideo={handleRemoveVideo}
          onResetVideos={handleResetVideos}
        />
      )}
    </div>
  );
}

export default App;
