import { useEffect, useRef, useState } from 'react';

interface MediaBackgroundProps {
  src: string;
  type?: 'image' | 'video' | 'auto';
  blurAmount?: string;
  scale?: number;
  offsetX?: string;
}

const MediaBackground: React.FC<MediaBackgroundProps> = ({
  src,
  type = 'auto',
  blurAmount = '1.5px',
  scale = 1.05,
  offsetX = '5%'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>(type !== 'auto' ? type : 'image');

  useEffect(() => {
    // Determine media type if set to auto
    if (type === 'auto') {
      const extension = src.split('.').pop()?.toLowerCase();
      if (extension === 'mp4' || extension === 'webm' || extension === 'ogg') {
        setMediaType('video');
      } else {
        setMediaType('image');
      }
    }

    // Auto-play the video when component mounts
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, [src, type, mediaType]);

  return (
    <div className="media-background">
      {mediaType === 'video' ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="media-element"
          style={{
            transform: `scale(${scale}) translateX(${offsetX})`,
          }}
        >
          <source src={src} type={`video/${src.split('.').pop()}`} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={src}
          alt="Background"
          className="media-element"
          style={{
            transform: `scale(${scale}) translateX(${offsetX})`,
          }}
        />
      )}
      <div 
        className="blur-overlay" 
        style={{ 
          backdropFilter: `blur(${blurAmount})`, 
          WebkitBackdropFilter: `blur(${blurAmount})` 
        }}
      ></div>
    </div>
  );
};

export default MediaBackground;
