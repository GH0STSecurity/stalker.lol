import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TokenModal from './TokenModal';

const LoginButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <motion.button
        className="absolute top-4 right-4 z-30 bg-stalker-dark/70 backdrop-blur-md border border-stalker-accent/50 text-stalker-light px-4 py-2 rounded-md font-mono text-sm hover:bg-stalker-dark/90 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openModal}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      >
        Login
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <TokenModal onClose={closeModal} />
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginButton;
