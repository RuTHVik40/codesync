import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icons from './Icons';

const CommandPalette = ({ isOpen, onClose, commands }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-lg w-96 max-w-full shadow-xl border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Icons.Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Type a command..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                autoFocus
              />
              <kbd className="px-2 py-1 text-xs bg-gray-700 rounded border border-gray-600 text-gray-300">ESC</kbd>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No commands found
              </div>
            ) : (
              filteredCommands.map((command, index) => (
                <button
                  key={command.name}
                  onClick={() => {
                    command.action();
                    onClose();
                  }}
                  className={`w-full text-left p-3 border-b border-gray-700 last:border-b-0 transition-colors ${
                    index === selectedIndex ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <command.icon className="w-4 h-4" />
                      <span className="font-medium">{command.name}</span>
                    </div>
                    {command.shortcut && (
                      <kbd className="text-xs bg-gray-600 px-2 py-1 rounded border border-gray-500">
                        {command.shortcut}
                      </kbd>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 ml-7">
                    {command.description}
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;