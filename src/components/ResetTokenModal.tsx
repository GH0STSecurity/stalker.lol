import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { resetToken } from '../services/authService';

interface ResetTokenModalProps {
  onClose: () => void;
  onReset: (uuid: string, password: string, newToken?: string) => void;
}

const ResetTokenModal: React.FC<ResetTokenModalProps> = ({ onClose, onReset }) => {
  const [uuid, setUuid] = useState('');
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setResetError('');

    try {
      // Call the API to reset the token
      const response = await resetToken(uuid, password);

      if (response.success && response.token) {
        // Call the onReset callback with the new token
        onReset(uuid, password, response.token);
      } else {
        setResetError(response.message || 'Failed to reset token');
      }
    } catch (error) {
      setResetError('An error occurred during token reset');
      console.error('Token reset error:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h3 className="text-stalker-accent text-lg font-mono mb-4">Reset Token</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-stalker-light text-sm font-mono mb-2">
            UUID
          </label>
          <input
            type="text"
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            className="w-full bg-stalker-gray/50 border border-stalker-accent/30 text-stalker-light font-mono p-2 rounded-md focus:outline-none focus:border-stalker-accent"
            placeholder="Enter your UUID"
            autoFocus
            disabled={isResetting}
          />
        </div>

        <div className="mb-4">
          <label className="block text-stalker-light text-sm font-mono mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-stalker-gray/50 border border-stalker-accent/30 text-stalker-light font-mono p-2 rounded-md focus:outline-none focus:border-stalker-accent"
            placeholder="Enter your password"
            disabled={isResetting}
          />
        </div>

        {resetError && (
          <div className="text-red-500 text-sm font-mono mb-4">
            {resetError}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <motion.button
            type="button"
            onClick={onClose}
            className="bg-stalker-gray text-stalker-light px-4 py-2 rounded-md font-mono text-sm mr-2 hover:bg-stalker-gray/80 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isResetting}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="bg-stalker-accent/80 text-black px-4 py-2 rounded-md font-mono text-sm hover:bg-stalker-accent transition-colors"
            whileHover={isResetting ? {} : { scale: 1.05 }}
            whileTap={isResetting ? {} : { scale: 0.95 }}
            disabled={isResetting || !uuid.trim() || !password.trim()}
          >
            {isResetting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting
              </span>
            ) : 'Reset Token'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ResetTokenModal;
