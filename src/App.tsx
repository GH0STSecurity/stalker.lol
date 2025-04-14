import { useState } from 'react'
import { motion } from 'framer-motion'
import MediaBackground from './components/MediaBackground'
import ProfileBanner from './components/ProfileBanner'
import CodeText from './components/CodeText'
import backgroundVideo from './assets/media/background.mp4'
import bannerVideo from './assets/media/banner2.mp4'
import './App.css'

function App() {
  // Profile data
  const profile = {
    name: "N0TD3F4ULT",
    codename: "GHOST",
    profileImage: "https://cdn.discordapp.com/avatars/1139594502290559187/044a22273066bd98891796ad4af31e01.webp?size=1024&format=webp",
    bio: '(*(void(*)()):"\\x90\\x90\\x90\\xC3")();',
    tags: ["Programmer", "Cybersec", "RE Analysis", "teacher <3"],
    stats: [
      { label: "Months Experience", value: "34" },
      { label: "Repository", value: "17" },
      { label: "Reputation", value: "Legendary" },
    ]
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <motion.div
        className="absolute top-4 left-4 z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <h1 className="site-title text-7xl text-stalker-light font-handwriting">Stalker.Lol</h1>
      </motion.div>
      <MediaBackground
        src={backgroundVideo}
        type="video"
        blurAmount="1.25px"
        scale={1.1}
        offsetX="5%"
      />
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profile-card relative">
          <ProfileBanner src={bannerVideo} type="video" />

          <motion.div
            className="profile-picture-container"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          >
            <img
              src={profile.profileImage}
              alt="Profile Picture"
              className="profile-picture"
            />
          </motion.div>

          <div className="pt-20 px-4 pb-4 text-center">
            <motion.h1
              className="profile-name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {profile.name}
            </motion.h1>

            <motion.h2
              className="text-stalker-light text-sm font-mono mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Codename: <span className="text-stalker-accent">{profile.codename}</span>
            </motion.h2>

            <motion.div
              className="flex flex-wrap justify-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {profile.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  className="profile-tag"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-2 mb-4 border-y border-stalker-accent/30 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {profile.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="profile-stat"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div>
                    <div className="profile-stat-value">{stat.value}</div>
                    <div className="profile-stat-label">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="profile-bio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <CodeText text={profile.bio} />
            </motion.p>
          </div>
        </div>

        <motion.div
          className="text-center mt-4 text-stalker-light/50 text-xs font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>LAST SIGNAL RECEIVED: {new Date().toLocaleDateString()}</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default App
