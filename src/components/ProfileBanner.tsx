import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ProfileBannerProps {
  src: string;
  type?: 'image' | 'video' | 'auto';
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({
  src,
  type = 'auto'
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
        console.error("Banner video autoplay failed:", error);
      });
    }
  }, [src, type, mediaType]);

  return (
    <div className="profile-header">
      {mediaType === 'video' ? (
        <motion.video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="profile-banner"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <source src={src} type={`video/${src.split('.').pop()}`} />
          Your browser does not support the video tag.
        </motion.video>
      ) : (
        <motion.img
          src={src}
          alt="Profile Banner"
          className="profile-banner"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
      )}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-stalker-dark to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.3 }}
      />
    </div>
  );
};

export default ProfileBanner;
