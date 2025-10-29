import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../contexts/UserContext'
import { useDropdownPosition } from '../hooks/useDropdownPosition'
import Icons from './Icons'

const UserProfile = () => {
  const { currentUser, logout, updateProfile, userPreferences, togglePreference } = useUser()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const { triggerRef, dropdownRef, position } = useDropdownPosition()

  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    role: currentUser?.role || 'developer'
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownRef, triggerRef])

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (editForm.name.trim() && editForm.email.trim()) {
      updateProfile(editForm)
      setIsDropdownOpen(false)
    }
  }

  const handlePreferenceChange = (key) => {
    togglePreference(key)
  }

  if (!currentUser) return null

  const roleColors = {
    developer: 'bg-blue-500',
    designer: 'bg-purple-500',
    manager: 'bg-green-500',
    reviewer: 'bg-yellow-500',
    guest: 'bg-gray-500'
  }

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors group border border-transparent hover:border-gray-600"
      >
        <div className="relative">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm relative overflow-hidden"
            style={{ backgroundColor: currentUser.color }}
          >
            {currentUser.avatar}
          </div>
          {/* Online Indicator */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800">
            <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="text-left hidden lg:block">
          <div className="text-sm font-medium text-gray-200 flex items-center space-x-2">
            <span>{currentUser.name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${roleColors[currentUser.role]} text-white`}>
              {currentUser.role}
            </span>
          </div>
          <div className="text-xs text-gray-400 flex items-center space-x-1">
            <Icons.Wifi className="w-3 h-3 text-green-400" />
            <span>Online</span>
          </div>
        </div>
        
        <Icons.ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu - Positioned to always be visible */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-professional z-50 overflow-hidden"
            style={position}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-gray-750 to-gray-800 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg relative"
                  style={{ backgroundColor: currentUser.color }}
                >
                  {currentUser.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-200 truncate">{currentUser.name}</div>
                  <div className="text-sm text-gray-400 truncate">{currentUser.email}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${roleColors[currentUser.role]} text-white`}>
                      {currentUser.role}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-green-400">
                      <Icons.Wifi className="w-3 h-3" />
                      <span>Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'profile' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'preferences' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Preferences
              </button>
            </div>

            {/* Tab Content */}
            <div className="max-h-96 overflow-y-auto">
              {activeTab === 'profile' && (
                <div className="p-4 space-y-4">
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-white text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-white text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role
                      </label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-white text-sm"
                      >
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="manager">Manager</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="guest">Guest</option>
                      </select>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
                    >
                      <Icons.Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-300">Show Participants</div>
                      <button
                        onClick={() => handlePreferenceChange('showParticipants')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          userPreferences.showParticipants ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            userPreferences.showParticipants ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-300">Show File Tree</div>
                      <button
                        onClick={() => handlePreferenceChange('showFileTree')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          userPreferences.showFileTree ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            userPreferences.showFileTree ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-300">Show Chat Panel</div>
                      <button
                        onClick={() => handlePreferenceChange('showChatPanel')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          userPreferences.showChatPanel ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            userPreferences.showChatPanel ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-300">Enable Notifications</div>
                      <button
                        onClick={() => handlePreferenceChange('enableNotifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          userPreferences.enableNotifications ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            userPreferences.enableNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-700 bg-gray-750">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {/* Would open settings in real app */}}
                  className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
                >
                  <Icons.Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                
                <button
                  onClick={logout}
                  className="flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm transition-colors"
                >
                  <Icons.Logout className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserProfile