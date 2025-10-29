import React, { useState } from 'react'
import { UserProvider, useUser } from './contexts/UserContext'
import LandingPage from './components/LandingPage'
import EditorPage from './components/EditorPage'
import LoginModal from './components/modals/LoginModal'

// Main App component wrapped with UserProvider
function AppContent() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [sessionId, setSessionId] = useState('')
  const [activeModal, setActiveModal] = useState(null)
  const { isLoggedIn, currentUser } = useUser()

  const handleCreateSession = () => {
    if (!isLoggedIn) {
      setActiveModal('login')
      return
    }
    const newSessionId = Math.random().toString(36).substring(2, 8).toUpperCase()
    setSessionId(newSessionId)
    setCurrentPage('editor')
  }

  const handleJoinSession = (id) => {
    if (!isLoggedIn) {
      setActiveModal('login')
      return
    }
    setSessionId(id || 'DEMO123')
    setCurrentPage('editor')
  }

  const handleLeaveSession = () => {
    setCurrentPage('landing')
    setSessionId('')
  }

  const handleLoginSuccess = () => {
    // If there was a pending session creation, proceed with it
    if (sessionId) {
      setCurrentPage('editor')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {currentPage === 'landing' ? (
        <LandingPage 
          onCreateSession={handleCreateSession}
          onJoinSession={handleJoinSession}
          currentUser={currentUser}
          onOpenLogin={() => setActiveModal('login')}
        />
      ) : (
        <EditorPage 
          sessionId={sessionId}
          onLeaveSession={handleLeaveSession}
          onOpenModal={setActiveModal}
        />
      )}

      {/* Login Modal */}
      {activeModal === 'login' && (
        <LoginModal 
          onClose={() => setActiveModal(null)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}

export default App