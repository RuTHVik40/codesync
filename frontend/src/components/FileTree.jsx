import React, { useState, useRef, useEffect } from 'react'; // Added useEffect import
import { motion, AnimatePresence } from 'framer-motion';
import Icons from './Icons';

const FileTree = ({ files, activeFile, onFileSelect, isVisible, onToggle }) => {
  const [contextMenu, setContextMenu] = useState(null);
  const [renamingFile, setRenamingFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const contextMenuRef = useRef(null);

  const handleContextMenu = (e, filename) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file: filename });
  };

  const handleRename = () => {
    if (newFileName && newFileName !== contextMenu.file) {
      // In a real app, you'd update the filename in your state
      console.log(`Renaming ${contextMenu.file} to ${newFileName}`);
    }
    setRenamingFile(null);
    setContextMenu(null);
    setNewFileName('');
  };

  const handleDelete = () => {
    // In a real app, you'd remove the file from your state
    console.log(`Deleting ${contextMenu.file}`);
    setContextMenu(null);
  };

  const handleDownload = () => {
    // In a real app, you'd trigger file download
    console.log(`Downloading ${contextMenu.file}`);
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu(null);
        setRenamingFile(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="h-full bg-gray-800 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-200">Files</h3>
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Icons.Close className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-2 space-y-1">
        {files.map((file) => (
          <motion.div
            key={file}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
              activeFile === file 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onFileSelect(file)}
            onContextMenu={(e) => handleContextMenu(e, file)}
          >
            <Icons.File className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate flex-1">{file}</span>
            {activeFile === file && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            ref={contextMenuRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 py-1 min-w-32"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {renamingFile === contextMenu.file ? (
              <div className="p-2">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                />
                <div className="flex space-x-1 mt-2">
                  <button
                    onClick={handleRename}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setRenamingFile(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-xs py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setRenamingFile(contextMenu.file);
                    setNewFileName(contextMenu.file);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
                >
                  Rename
                </button>
                <button
                  onClick={handleDownload}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
                >
                  Download
                </button>
                <div className="border-t border-gray-700 my-1"></div>
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 hover:bg-red-600 text-red-400 hover:text-white text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileTree;