import React from 'react';
import { motion } from 'framer-motion';

const UserCursor = ({ user, position, isTyping = false }) => {
  if (!position) return null;

  return (
    <motion.div
      className="absolute z-10 pointer-events-none"
      style={{ left: position.x, top: position.y }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {/* Cursor */}
      <div 
        className="w-0.5 h-6 relative"
        style={{ backgroundColor: user.color }}
      >
        {/* Cursor caret */}
        <div 
          className="w-2 h-2 transform rotate-45 absolute -top-1 -left-0.5"
          style={{ backgroundColor: user.color }}
        />
      </div>
      
      {/* User info */}
      <div className="flex items-center space-x-2 mt-1">
        <div 
          className="text-xs text-white px-2 py-1 rounded shadow-lg whitespace-nowrap flex items-center space-x-2"
          style={{ backgroundColor: user.color }}
        >
          <span>{user.name}</span>
          {isTyping && (
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserCursor;