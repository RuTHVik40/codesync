import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userPreferences, setUserPreferences] = useState({
    theme: 'dark',
    fontSize: 14,
    autoSave: true,
    showLineNumbers: true,
    wordWrap: false,
    tabSize: 2,
    enableNotifications: true,
    showParticipants: true,
    showChatPanel: true,
    showFileTree: true
  })

  // Load user data and preferences on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    const storedPreferences = localStorage.getItem('codesync_preferences')
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser))
      setIsLoggedIn(true)
    }
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences))
    }
  }, [])

  const login = (user, token) => {
    // Enrich user object with needed display fields for UI
    const baseName = user.username || user.name || user.email?.split('@')[0] || 'User';
    const roleColors = {
      developer: '#3B82F6',
      designer: '#8B5CF6',
      manager: '#10B981',
      reviewer: '#F59E0B',
      guest: '#6B7280'
    };
    const enhancedUser = {
      ...user,
      name: baseName,
      avatar: baseName[0].toUpperCase(),
      color: roleColors[user.role || 'guest'],
      isOnline: true,
    };
    setCurrentUser(enhancedUser)
    setIsLoggedIn(true)
    localStorage.setItem('user', JSON.stringify(enhancedUser))
    localStorage.setItem('token', token)
  }

  const logout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const updateProfile = (userData) => {
    const updatedUser = { 
      ...currentUser, 
      ...userData,
      lastActive: new Date().toISOString()
    }
    setCurrentUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const updatePreferences = (newPreferences) => {
    const updatedPreferences = { ...userPreferences, ...newPreferences }
    setUserPreferences(updatedPreferences)
    localStorage.setItem('codesync_preferences', JSON.stringify(updatedPreferences))
  }

  const togglePreference = (key) => {
    updatePreferences({ [key]: !userPreferences[key] })
  }

  const value = {
    currentUser,
    isLoggedIn,
    userPreferences,
    login,
    logout,
    updateProfile,
    updatePreferences,
    togglePreference
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
