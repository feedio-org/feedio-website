import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import toast from 'react-hot-toast';
import { DownloadOutlined } from '@ant-design/icons';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const Preview = ({ selectedShortData }) => {
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const videoNode = useRef(null);  // Reference for the video element
  const playerRef = useRef(null);   // Reference for the video.js player instance

  // Handle video download
  const handleDownload = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('File downloaded successfully');
  };

  // Function to calculate video aspect ratio
  const handleVideoMetadata = (e) => {
    const { videoWidth, videoHeight } = e.target;
    const ratio = (videoWidth / videoHeight).toFixed(2);

    if (ratio < 1) {
      setAspectRatio('9:16');
    } else {
      setAspectRatio('16:9');
    }
  };

  useEffect(() => {
    // Initialize the video.js player
    if (videoNode.current && !playerRef.current) {
      const player = videojs(videoNode.current, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        responsive: true,
        fluid: true,
      });
      playerRef.current = player;

      // Set video metadata handler
      player.on('loadedmetadata', handleVideoMetadata);

      return () => {
        // Cleanup video.js player when the component unmounts
        if (playerRef.current) {
          playerRef.current.dispose();
        }
      };
    }
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
      <div data-vjs-player>
        <video
          ref={videoNode}  // Attach the video.js instance to the element
          className="video-js vjs-default-skin"
          autoPlay
          width={aspectRatio === '9:16' ? '19%' : '60%'}
          height={aspectRatio === '9:16' ? '600px' : 'auto'}
          style={{ borderRadius: '10px', objectFit: 'contain' }}
        >
          <source src={selectedShortData.video_location} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button
          key="submit"
          size="large"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => handleDownload(selectedShortData?.video_location)}
        >
          Download Video
        </Button>
      </div>
    </div>
  );
};

export default Preview;
