import React from 'react';
import { motion } from 'framer-motion';

interface PasswordStrengthMeterProps {
  strength: number; // 0-4 scale
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ strength }) => {
  // Calculate width percentage based on strength (0-4)
  const widthPercentage = (strength / 4) * 100;
  
  // Determine color based on strength
  const getColor = () => {
    switch (strength) {
      case 0:
        return 'bg-red-600';
      case 1:
        return 'bg-orange-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-green-500';
      case 4:
        return 'bg-green-400';
      default:
        return 'bg-red-600';
    }
  };
  
  // Get strength label
  const getLabel = () => {
    switch (strength) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return 'Very Weak';
    }
  };

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full bg-stalker-gray rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${widthPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="text-xs font-mono mt-1 text-stalker-light/70">
        {strength > 0 ? getLabel() : 'Enter password'}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
