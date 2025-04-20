import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { generateUUID } from '../services/authService';

interface NewUUIDModalProps {
  onClose: () => void;
}

const NewUUIDModal: React.FC<NewUUIDModalProps> = ({ onClose }) => {
  const [uuid, setUuid] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [serverNote, setServerNote] = useState('');

  // Function to generate UUID and token
  const generateNewUUIDAndToken = async () => {
    // Only generate if password is strong enough (strength >= 3)
    if (password.length > 0 && passwordStrength >= 3) {
      setIsGenerating(true);
      setGenerationError('');

      try {
        // Call the API to generate a new UUID and token
        const response = await generateUUID(password);

        if (response.success) {
          setUuid(response.uuid);
          setToken(response.token);
          setServerNote('UUID and token generated successfully from server.');
        } else {
          setGenerationError(response.message || 'Failed to generate UUID and token');
          setServerNote('Error: Server-side generation failed. Using client-side fallback for demo purposes only.');

          // Fallback to client-side generation for demo purposes
          const fallbackUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
          setUuid(fallbackUuid);
          setToken(btoa(`${fallbackUuid}:${password}:${Date.now()}`));
        }
      } catch (error) {
        console.error('UUID generation error:', error);
        setGenerationError('An error occurred during UUID generation');
        setServerNote('Error: Server connection failed. Using client-side fallback for demo purposes only.');

        // Fallback to client-side generation for demo purposes
        const fallbackUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        setUuid(fallbackUuid);
        setToken(btoa(`${fallbackUuid}:${password}:${Date.now()}`));
      } finally {
        setIsGenerating(false);
      }
    } else {
      setGenerationError('Password must be at least "Good" strength to generate a token');
    }
  };

  // Calculate password strength
  useEffect(() => {
    // Simple password strength calculation
    let strength = 0;

    if (password.length > 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;

    setPasswordStrength(strength);
  }, [password]);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    alert('Token copied to clipboard!');
  };

  const handleResetUuid = () => {
    // Generate a new UUID
    const newUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setUuid(newUuid);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h3 className="text-stalker-accent text-lg font-mono mb-4">Generate New UUID & Token</h3>

      {serverNote && (
        <div className="bg-yellow-900/50 border border-yellow-600/50 rounded-md p-3 mb-4">
          <p className="text-yellow-200 text-xs font-mono">{serverNote}</p>
        </div>
      )}

      {generationError && (
        <div className="bg-red-900/50 border border-red-600/50 rounded-md p-3 mb-4">
          <p className="text-red-200 text-xs font-mono">{generationError}</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-stalker-light text-sm font-mono mb-2">
          UUID
        </label>
        <div className="flex">
          <input
            type="text"
            value={uuid}
            readOnly
            className="flex-grow bg-stalker-gray/50 border border-stalker-accent/30 text-stalker-light font-mono p-2 rounded-l-md focus:outline-none"
          />
          <button
            type="button"
            onClick={handleResetUuid}
            className="bg-blue-600 text-white px-3 py-2 rounded-r-md font-mono text-sm hover:bg-blue-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-stalker-light text-sm font-mono mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-stalker-gray/50 border border-stalker-accent/30 text-stalker-light font-mono p-2 rounded-md focus:outline-none focus:border-stalker-accent"
            placeholder="Create a strong password"
            autoFocus
            disabled={isGenerating}
          />
          {isGenerating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-stalker-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        <PasswordStrengthMeter strength={passwordStrength} />
        <p className="text-xs text-stalker-light/70 mt-1 font-mono">
          {passwordStrength < 3 ? 'Password must be at least "Good" strength to generate a token' : ''}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-stalker-light text-sm font-mono mb-2">
          Token
        </label>
        <div className="flex">
          <input
            type="text"
            value={token}
            readOnly
            className="flex-grow bg-stalker-gray/50 border border-stalker-accent/30 text-stalker-light font-mono p-2 rounded-l-md focus:outline-none"
          />
          <button
            type="button"
            onClick={token ? handleCopyToken : generateNewUUIDAndToken}
            className={`${token ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white px-3 py-2 rounded-r-md font-mono text-sm transition-colors`}
            disabled={isGenerating || (passwordStrength < 3 && !token)}
          >
            {token ? 'Copy' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <motion.button
          type="button"
          onClick={onClose}
          className="bg-stalker-accent/80 text-black px-4 py-2 rounded-md font-mono text-sm hover:bg-stalker-accent transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Done
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NewUUIDModal;
