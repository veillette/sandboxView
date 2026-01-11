# Kids Video Player

**Live Demo:** [https://veillette.github.io/sandboxView/](https://veillette.github.io/sandboxView/)

A "Walled Garden" video player Progressive Web App (PWA) designed for young children. This app provides a safe, controlled environment where kids can only watch pre-approved YouTube videos without access to search, recommendations, comments, or external links.

## Features

- **Hardcoded Video Library**: Only plays videos from a curated list of YouTube IDs
- **Child-Friendly UI**: Large, colorful thumbnails with high-contrast design
- **Zero Navigation**: Simple grid view with full-screen playback
- **Safety First**: No search, comments, recommendations, or external links
- **Parental Gate**: Math problem + hold button to access settings
- **PWA Support**: Install on any device without app stores
- **Offline Thumbnails**: Cached thumbnails for faster loading

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone or navigate to the project
cd kids-video-player

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
# Build the PWA
npm run build

# Preview the production build
npm run preview
```

## Installing as a PWA

### On iPad/iPhone (iOS)

1. Open Safari and navigate to your deployed app URL
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it "Kids Videos" and tap **Add**
5. The app will appear on the home screen with its icon

### On Android Tablet/Phone

1. Open Chrome and navigate to your deployed app URL
2. Tap the **three-dot menu** (top right)
3. Tap **"Add to Home screen"** or **"Install app"**
4. Confirm the installation
5. The app will appear in your app drawer

### On Desktop (Chrome/Edge)

1. Navigate to the app URL
2. Click the **install icon** in the address bar (or menu > Install)
3. Confirm installation

## Enabling "Closed Environment" Mode

To prevent children from accidentally leaving the app:

### iOS - Guided Access

1. Go to **Settings > Accessibility > Guided Access**
2. Turn **ON** Guided Access
3. Set a passcode (different from device passcode)
4. Open the Kids Video Player app
5. **Triple-click the Side/Home button** to start Guided Access
6. Tap **Start** in the top right

**To exit**: Triple-click Side/Home button and enter your passcode

### Android - App Pinning

1. Go to **Settings > Security > App pinning** (or Screen pinning)
2. Turn **ON** app pinning
3. Open the Kids Video Player app
4. Open **Recent Apps** (square button or swipe up)
5. Tap the app icon at the top of the card
6. Select **"Pin this app"**

**To exit**: Hold **Back + Home** buttons (or Back + Recent) for 3 seconds

### Additional Parental Controls

For extra safety, consider:

- **iOS**: Enable Screen Time restrictions
- **Android**: Use Digital Wellbeing or Family Link
- **Router**: Block YouTube.com domain except through the app

## Managing the Video Library

### Accessing Settings

1. Tap the **gear icon** (top right corner of home screen)
2. Complete the parental gate:
   - Solve the math problem, OR
   - Hold the button for 3 seconds
3. You'll enter the parent settings panel

### Adding Videos

1. Find a child-appropriate YouTube video
2. Copy the video URL or ID (the 11-character code)
3. In settings, tap **"Add Video"**
4. Paste the URL/ID and add a child-friendly title
5. Choose an emoji and color
6. Tap **"Add Video"**

### Removing Videos

In the settings panel, tap the **trash icon** next to any video to remove it.

### Resetting to Defaults

Tap **"Reset to Defaults"** to restore the original video library.

## Customizing the Default Video Library

Edit `src/data/videos.json` to change the default videos:

```json
[
  {
    "id": "6A_uNfM-m9M",       // YouTube video ID
    "title": "Chanson thème",  // Display title
    "emoji": "🏠",             // Thumbnail emoji
    "color": "#FF6B6B"         // Card background color
  }
]
```

### Finding YouTube Video IDs

The video ID is the 11-character code in YouTube URLs:

- `https://www.youtube.com/watch?v=XqZsoesa55w` → ID: `XqZsoesa55w`
- `https://youtu.be/XqZsoesa55w` → ID: `XqZsoesa55w`

## YouTube Player Configuration

The player uses these safety parameters:

```javascript
{
  rel: 0,              // Don't show related videos from other channels
  modestbranding: 1,   // Minimal YouTube branding
  controls: 1,         // Show play/pause controls
  disablekb: 1,        // Disable keyboard shortcuts
  fs: 0,               // Disable fullscreen button (already fullscreen)
  iv_load_policy: 3,   // Hide video annotations
  playsinline: 1,      // Play inline on iOS
  showinfo: 0,         // Hide video title bar
  origin: '<app-url>'  // Security origin
}
```

## Project Structure

```
kids-video-player/
├── public/
│   ├── icon-192.svg      # PWA icon (small)
│   ├── icon-512.svg      # PWA icon (large)
│   └── robots.txt        # Search engine config
├── src/
│   ├── components/
│   │   ├── VideoGrid.jsx     # Home screen grid
│   │   ├── VideoPlayer.jsx   # Full-screen player
│   │   ├── ParentalGate.jsx  # Access verification
│   │   └── SettingsPanel.jsx # Parent settings
│   ├── data/
│   │   └── videos.json       # Default video library
│   ├── styles/
│   │   └── index.css         # All styling
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── scripts/
│   └── generate-icons.js     # PNG icon generator
├── index.html                # HTML template
├── vite.config.js            # Build configuration
└── package.json              # Dependencies
```

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Option 2: Netlify

```bash
npm run build
# Drag 'dist' folder to Netlify
```

### Option 3: GitHub Pages (Automatic)

This repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`:

1. Enable GitHub Pages in your repository settings (Settings > Pages > Source: GitHub Actions)
2. Push to the `main` branch
3. The app will be deployed to `https://<username>.github.io/<repo-name>/`

### Option 4: Self-Hosted

```bash
npm run build
# Serve the 'dist' folder with any static server
npx serve dist
```

## Troubleshooting

### Videos Won't Play

- Ensure the YouTube video ID is correct
- Some videos have embedding disabled by the uploader
- Check your internet connection

### App Won't Install as PWA

- Must be served over HTTPS (except localhost)
- Clear browser cache and try again
- Some browsers require visiting the site multiple times

### Parental Gate Not Working

- Ensure JavaScript is enabled
- Try the alternative "hold button" method
- Clear app data and reload

### Player Controls Not Visible

- Tap the video area to show controls
- YouTube's built-in controls appear at the bottom

## Browser Support

- Chrome 80+
- Safari 14+ (iOS 14+)
- Firefox 80+
- Edge 80+

## Security Notes

- Videos are stored locally in browser storage
- No data is sent to external servers (except YouTube for playback)
- The parental gate is a deterrent, not a security measure
- For maximum safety, combine with OS-level parental controls

## License

MIT License - Feel free to modify for your family's needs!

## Contributing

This is a personal/family project. Feel free to fork and customize for your own use.

---

Made with love for little ones who just want to watch their favorite videos on repeat.
