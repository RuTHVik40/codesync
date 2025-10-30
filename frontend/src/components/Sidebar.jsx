import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icons from './Icons'

const Sidebar = ({ users, onUserClick, isVisible, onToggle }) => {
  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 top-20 z-40 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-lg transition-colors"
      >
        <Icons.Users className="w-5 h-5 text-gray-300" />
      </button>
    )
  }

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="w-80 bg-gray-800 border-l border-gray-700 flex-shrink-0 h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-200 flex items-center space-x-2">
              <Icons.Users className="w-5 h-5" />
              <span>Participants</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">{users.length} team members</p>
          </div>
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-700"
          >
            <Icons.Close className="w-4 h-4" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="mt-3 relative">
          <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search participants..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-sm text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {users.map((user, index) => (
            <motion.div
              key={`${user.id}-${index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onUserClick(user)}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors group border border-transparent hover:border-gray-500"
            >
              {/* User Avatar */}
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold relative"
                  style={{ backgroundColor: user.color }}
                >
                  {user.avatar}
                </div>
                {/* Online Indicator */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800">
                  <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-100 truncate">
                    {user.name}
                  </span>
                  {user.id === 'local' && (
                    <span className="text-xs bg-blue-500 px-1.5 py-0.5 rounded text-white flex-shrink-0">You</span>
                  )}
                  {user.role && user.id !== 'local' && (
                    <span className={`text-xs px-1.5 py-0.5 rounded text-white flex-shrink-0 ${
                      user.role === 'developer' ? 'bg-blue-500' :
                      user.role === 'designer' ? 'bg-purple-500' :
                      user.role === 'manager' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`}>
                      {user.role}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                      style={{ backgroundColor: user.color }}
                    ></div>
                    <span className="truncate">Active now</span>
                  </div>
                  {user.isTyping && (
                    <div className="text-blue-400 flex items-center space-x-1">
                      <Icons.Edit className="w-3 h-3" />
                      <span>typing...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Menu */}
              <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white transition-all">
                <Icons.ChevronDown className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-750 flex-shrink-0">
        <div className="text-xs text-gray-400 space-y-2">
          <div className="flex justify-between items-center">
            <span>Connection Quality</span>
            <div className="flex items-center space-x-1 text-green-400">
              <Icons.Wifi className="w-3 h-3" />
              <span>Excellent</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Network Latency</span>
            <span className="text-green-400">~42ms</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Last Sync</span>
            <span className="text-gray-300">Just now</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar