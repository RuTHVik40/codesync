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
    const storedUser = localStorage.getItem('codesync_user')
    const storedPreferences = localStorage.getItem('codesync_preferences')
    
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUser(user)
      setIsLoggedIn(true)
    }
    
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences))
    }
  }, [])

  const login = (userData) => {
    const user = {
      id: 'local',
      name: userData.name,
      email: userData.email,
      avatar: userData.name.charAt(0).toUpperCase(),
      color: '#3B82F6',
      role: userData.role || 'developer',
      isOnline: true,
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }
    setCurrentUser(user)
    setIsLoggedIn(true)
    localStorage.setItem('codesync_user', JSON.stringify(user))
  }

  const logout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('codesync_user')
  }

  const updateProfile = (userData) => {
    const updatedUser = { 
      ...currentUser, 
      ...userData,
      lastActive: new Date().toISOString()
    }
    setCurrentUser(updatedUser)
    localStorage.setItem('codesync_user', JSON.stringify(updatedUser))
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