import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import UserProfile from './UserProfile'
import { useUser } from '../contexts/UserContext'
import Icons from './Icons'

const Navbar = ({ 
  sessionId, 
  onLeaveSession, 
  onOpenModal,
  simulateLatency,
  onLatencyToggle,
  onOpenLogin,
  onOpenCommandPalette,
  userPreferences,
  onTogglePreference
}) => {
  const { isLoggedIn, currentUser } = useUser()
  const [showParticipantsDropdown, setShowParticipantsDropdown] = useState(false)
  const participantsRef = useRef(null)
  
  // Navigation buttons
  const navButtons = [
    { 
      id: 'voice-video', 
      label: 'Call', 
      icon: Icons.Video, 
      description: 'Start voice or video call',
      isCombined: true
    },
    { id: 'download', label: 'Download', icon: Icons.Download, description: 'Download project files' },
    { id: 'upload', label: 'Upload', icon: Icons.Upload, description: 'Upload files to project' },
  ]

  // Simulated users data
  const simulatedUsers = [
    { id: 1, name: 'Alex Johnson', role: 'developer', color: '#3B82F6', isOnline: true, avatar: 'AJ' },
    { id: 2, name: 'Sam Chen', role: 'designer', color: '#8B5CF6', isOnline: true, avatar: 'SC' },
    { id: 3, name: 'Taylor Swift', role: 'reviewer', color: '#10B981', isOnline: false, avatar: 'TS' },
    { id: 4, name: 'Mike Ross', role: 'manager', color: '#F59E0B', isOnline: true, avatar: 'MR' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (participantsRef.current && !participantsRef.current.contains(event.target)) {
        setShowParticipantsDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleParticipantsClick = () => {
    setShowParticipantsDropdown(!showParticipantsDropdown)
  }

  const roleColors = {
    developer: 'bg-blue-500',
    designer: 'bg-purple-500',
    manager: 'bg-green-500',
    reviewer: 'bg-yellow-500',
    guest: 'bg-gray-500'
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-2 relative z-50">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icons.Code className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="font-bold text-md bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CodeSync
              </span>
              <div className="text-xs text-gray-400">Real-time Collaboration</div>
            </div>
          </div>
          
          {/* Session Info - Only Invite Button */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onOpenModal('invite')}
              className="flex items-center space-x-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
            >
              <Icons.Share className="w-3.5 h-3.5" />
              <span>Invite</span>
            </button>
          </div>
        </div> {/* Added missing closing div */}
      
        {/* Center Section - Participants & File Tree */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1 border-l border-gray-600 pl-3" ref={participantsRef}>
            {/* Participants Button */}
            <div className="relative">
              <button
                onClick={handleParticipantsClick}
                className={`p-1.5 rounded transition-colors ${
                  userPreferences.showParticipants 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
                title="Show participants"
              >
                <Icons.Users className="w-3.5 h-3.5" />
              </button>

              {/* Participants Dropdown */}
              <AnimatePresence>
                {showParticipantsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-professional z-50"
                  >
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-200">Participants</h3>
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          {simulatedUsers.filter(user => user.isOnline).length} online
                        </span>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {simulatedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-750 transition-colors border-b border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                                style={{ backgroundColor: user.color }}
                              >
                                {user.avatar}
                              </div>
                              {user.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800">
                                  <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-200 truncate">
                                {user.name}
                                {currentUser && user.id === currentUser.id && (
                                  <span className="text-blue-400 ml-1">(You)</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${roleColors[user.role]} text-white`}>
                                  {user.role}
                                </span>
                                {!user.isOnline && (
                                  <span className="text-xs text-gray-500">Offline</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {user.isOnline && (
                              <>
                                <button className="p-1 text-blue-400 hover:text-blue-300 transition-colors" title="Start voice call">
                                  <Icons.Phone className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1 text-green-400 hover:text-green-300 transition-colors" title="Send message">
                                  <Icons.Message className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 border-t border-gray-700 bg-gray-750">
                      <button
                        onClick={() => onOpenModal('invite')}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors"
                      >
                        <Icons.Share className="w-3.5 h-3.5" />
                        <span>Invite More People</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* File Tree Toggle */}
            <button
              onClick={() => onTogglePreference('showFileTree')}
              className={`p-1.5 rounded transition-colors ${
                userPreferences.showFileTree 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
              title="Toggle file tree"
            >
              <Icons.Folder className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Section - Actions, Command Palette, Notifications, User */}
        <div className="flex items-center space-x-2">
          {/* Action Buttons */}
          {navButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <React.Fragment key={button.label}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenModal(button.id)}
                  className={`flex items-center space-x-1 px-2 py-1.5 rounded text-xs transition-colors group relative ${
                    button.isCombined 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
                  title={button.description}
                >
                  {button.isCombined ? (
                    <div className="relative">
                      <Icons.Video className="w-3.5 h-3.5" />
                      <Icons.Mic className="w-2.5 h-2.5 absolute -bottom-1 -right-1 bg-white text-blue-600 rounded-full p-0.5" />
                    </div>
                  ) : (
                    <IconComponent className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden lg:inline">{button.label}</span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50 border border-gray-700">
                    {button.description}
                    {button.isCombined && (
                      <div className="text-gray-400 text-xs mt-0.5">Voice & Video combined</div>
                    )}
                  </div>
                </motion.button>

                {index < navButtons.length - 1 && (
                  <div className="w-px h-5 bg-gray-600"></div>
                )}
              </React.Fragment>
            )
          })}

          {/* Separator before Command Palette */}
          <div className="w-px h-5 bg-gray-600"></div>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
            title="Open command palette (Ctrl+K)"
          >
            <Icons.Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Commands</span>
            <kbd className="text-xs bg-gray-600 px-1.5 py-0.5 rounded border border-gray-500 text-gray-300 hidden md:inline">
              Ctrl+K
            </kbd>
          </button>

          {/* Separator before notifications */}
          <div className="w-px h-5 bg-gray-600"></div>

          {/* Notifications */}
          <button className="relative p-1.5 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-700">
            <Icons.Bell className="w-4 h-4" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-gray-800"></div>
          </button>

          {/* User Profile or Login */}
          {isLoggedIn ? (
            <div className="relative">
              <UserProfile />
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenLogin}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded text-xs font-medium transition-colors"
            >
              <Icons.User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </motion.button>
          )}

          {/* Separator before leave button */}
          <div className="w-px h-5 bg-gray-600"></div>

          {/* Leave Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLeaveSession}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition-colors"
          >
            <Icons.Logout className="w-3.5 h-3.5" />
            <span>Leave</span>
          </motion.button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar