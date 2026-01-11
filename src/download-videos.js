#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load video data from videos.json and take first 6
const allVideos = require('./data/videos.json');
const videos = allVideos.slice(0, 6);

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'videos');
const FORMAT = 'best[ext=mp4]/best'; // Prefer mp4, fallback to best available

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
}

// Check if yt-dlp is installed
function checkYtDlp() {
  try {
    execSync('yt-dlp --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Download a single video
function downloadVideo(video, index) {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    
    // Sanitize filename (remove special characters)
    const safeTitle = video.title
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    const outputTemplate = path.join(OUTPUT_DIR, `${safeTitle}.%(ext)s`);
    
    console.log(`\n${video.emoji} [${index + 1}/${videos.length}] Downloading: ${video.title}`);
    console.log(`   URL: ${url}`);
    
    const args = [
      '-f', FORMAT,
      '-o', outputTemplate,
      '--no-playlist',
      '--progress',
      '--newline',
      url
    ];
    
    const process = spawn('yt-dlp', args, { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log(`   ✅ Successfully downloaded: ${video.title}`);
        resolve({ success: true, video });
      } else {
        console.error(`   ❌ Failed to download: ${video.title} (exit code: ${code})`);
        resolve({ success: false, video, error: `Exit code: ${code}` });
      }
    });
    
    process.on('error', (err) => {
      console.error(`   ❌ Error downloading ${video.title}: ${err.message}`);
      resolve({ success: false, video, error: err.message });
    });
  });
}

// Main function
async function main() {
  console.log('🎬 YouTube Video Downloader');
  console.log('===========================\n');
  
  // Check for yt-dlp
  if (!checkYtDlp()) {
    console.error('❌ yt-dlp is not installed!');
    console.log('\nTo install on WSL2/Ubuntu:');
    console.log('  sudo apt update');
    console.log('  sudo apt install yt-dlp');
    console.log('\nOr using pip:');
    console.log('  pip install yt-dlp');
    console.log('\nOr download directly:');
    console.log('  sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp');
    console.log('  sudo chmod a+rx /usr/local/bin/yt-dlp');
    process.exit(1);
  }
  
  console.log(`📋 Found ${videos.length} videos to download`);
  console.log(`📂 Output directory: ${path.resolve(OUTPUT_DIR)}\n`);
  
  const results = [];
  
  // Download videos sequentially
  for (let i = 0; i < videos.length; i++) {
    const result = await downloadVideo(videos[i], i);
    results.push(result);
  }
  
  // Summary
  console.log('\n===========================');
  console.log('📊 Download Summary');
  console.log('===========================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (failed.length > 0) {
    console.log('\nFailed downloads:');
    failed.forEach(f => {
      console.log(`  - ${f.video.title}: ${f.error}`);
    });
  }
  
  console.log(`\n📂 Videos saved to: ${path.resolve(OUTPUT_DIR)}`);
}

main().catch(console.error);
