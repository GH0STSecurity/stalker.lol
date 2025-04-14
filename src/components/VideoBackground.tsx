import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  blurAmount?: string;
  scale?: number;
  offsetX?: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  blurAmount = '3px',
  scale = 1.05,
  offsetX = '5%'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play the video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="video-background">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="video-element"
        style={{
          transform: `scale(${scale}) translateX(${offsetX})`,
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="blur-overlay" style={{ backdropFilter: `blur(${blurAmount})`, WebkitBackdropFilter: `blur(${blurAmount})` }}></div>
    </div>
  );
};

export default VideoBackground;
