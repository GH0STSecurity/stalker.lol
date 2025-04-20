import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import ResetTokenModal from './ResetTokenModal';
import NewUUIDModal from './NewUUIDModal';
import { validateToken } from '../services/authService';

interface TokenModalProps {
  onClose: () => void;
}

const TokenModal: React.FC<TokenModalProps> = ({ onClose }) => {
  const [token, setToken] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showNewUUIDModal, setShowNewUUIDModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setValidationError('');

    try {
      // Call the API to validate the token
      const response = await validateToken(token);

      if (response.success) {
        if (response.isAdmin) {
          setShowNewUUIDModal(true);
        } else {
          // Handle successful login for regular users
          console.log('Valid token, redirecting...');
          // Here you would redirect to the dashboard or perform other actions
        }
      } else {
        setValidationError(response.message || 'Invalid token');
      }
    } catch (error) {
      setValidationError('An error occurred during validation');
      console.error('Token validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const handleCopyToken = () => {
    // This is a placeholder - in a real app, you'd have a token to copy
    navigator.clipboard.writeText('your-generated-token-here');
    alert('Token copied to clipboard!');
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className="bg-stalker-dark/90 backdrop-blur-md border border-stalker-accent/50 rounded-lg p-6 w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <h2 className="text-stalker-accent text-xl font-mono mb-4">Authentication</h2>

        {!showResetModal && !showNewUUIDModal && (
          <form onSubmit={handleTokenSubmit}>
            <div className="mb-4">
              <label className="block text-stalker-light text-sm font-mono mb-2">
                Enter Token
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="flex-grow bg-stalker-gray/50 border border-stalker-accent/30 text-stalker-light font-mono p-2 rounded-l-md focus:outline-none focus:border-stalker-accent"
                  placeholder="Enter your access token"
                  autoFocus
                  disabled={isValidating}
                />
                <button
                  type="button"
                  onClick={handleResetClick}
                  className="bg-blue-600 text-white px-3 py-2 rounded-r-md font-mono text-sm hover:bg-blue-700 transition-colors"
                  disabled={isValidating}
                >
                  Reset
                </button>
              </div>
              {validationError && (
                <div className="text-red-500 text-sm font-mono mt-2">
                  {validationError}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <motion.button
                type="button"
                onClick={onClose}
                className="bg-stalker-gray text-stalker-light px-4 py-2 rounded-md font-mono text-sm mr-2 hover:bg-stalker-gray/80 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isValidating}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="bg-stalker-accent/80 text-black px-4 py-2 rounded-md font-mono text-sm hover:bg-stalker-accent transition-colors"
                whileHover={isValidating ? {} : { scale: 1.05 }}
                whileTap={isValidating ? {} : { scale: 0.95 }}
                disabled={isValidating || !token.trim()}
              >
                {isValidating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validating
                  </span>
                ) : 'Submit'}
              </motion.button>
            </div>
          </form>
        )}

        {showResetModal && (
          <ResetTokenModal
            onClose={() => setShowResetModal(false)}
            onReset={(uuid, password, newToken) => {
              setShowResetModal(false);
              if (newToken) {
                setToken(newToken);
                setValidationError('');
              }
            }}
          />
        )}

        {showNewUUIDModal && (
          <NewUUIDModal
            onClose={() => {
              setShowNewUUIDModal(false);
              onClose();
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default TokenModal;
