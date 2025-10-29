import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ChatPanel from './ChatPanel'
import FileTree from './FileTree'
import InviteModal from './modals/InviteModal'
import UploadModal from './modals/UploadModal'
import DownloadModal from './modals/DownloadModal'
import VoiceVideoModal from './modals/VoiceVideoModal'
import CommandPalette from './CommandPalette'
import UserCursor from './UserCursor'
import VirtualizedEditor from './VirtualizedEditor'
import { ToastContainer } from './Toast'
import { EditorSkeleton, FileTreeSkeleton } from './LoadingStates'
import { useUser } from '../contexts/UserContext'
import { useToast } from '../hooks/useToast'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import useSimulatedUsers from '../hooks/useSimulatedUsers'
import Icons from './Icons'

const EditorPage = ({ sessionId, onLeaveSession }) => {
  const { userPreferences, togglePreference } = useUser()
  const { toasts, addToast, removeToast } = useToast()
  const [activeFile, setActiveFile] = useState('index.js')
  const [showChat, setShowChat] = useState(userPreferences.showChatPanel)
  const [showFileTree, setShowFileTree] = useState(userPreferences.showFileTree)
  const [activeModal, setActiveModal] = useState(null)
  const [simulateLatency, setSimulateLatency] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userCursors, setUserCursors] = useState({})
  const [useVirtualEditor, setUseVirtualEditor] = useState(false)
  
  const { users, activities, code, setCode, addActivity, simulateUserEdit } = useSimulatedUsers(sessionId)

  // Define onOpenModal function
  const onOpenModal = useCallback((modalType) => {
    setActiveModal(modalType)
    addToast(`${modalType.replace('-', ' ')} modal opened`, 'info')
  }, [addToast])

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Command palette commands
  const commands = [
    {
      name: 'Create Session',
      description: 'Start a new collaboration session',
      icon: Icons.Code,
      action: () => addToast('Create session command triggered', 'info'),
      shortcut: 'Ctrl+N'
    },
    {
      name: 'Upload Files',
      description: 'Upload project files to workspace',
      icon: Icons.Upload,
      action: () => onOpenModal('upload'),
      shortcut: 'Ctrl+P'
    },
    {
      name: 'Download Project',
      description: 'Download all project files',
      icon: Icons.Download,
      action: () => onOpenModal('download'),
      shortcut: 'Ctrl+S'
    },
    {
      name: 'Toggle File Tree',
      description: 'Show/hide file explorer',
      icon: Icons.Folder,
      action: () => {
        togglePreference('showFileTree')
        addToast('File tree toggled', 'info')
      },
      shortcut: 'Ctrl+D'
    },
    {
      name: 'Toggle Chat',
      description: 'Show/hide chat panel',
      icon: Icons.Message,
      action: () => {
        togglePreference('showChatPanel')
        addToast('Chat panel toggled', 'info')
      },
      shortcut: 'Ctrl+C'
    },
    {
      name: 'Start Voice Call',
      description: 'Begin voice conversation',
      icon: Icons.Mic,
      action: () => onOpenModal('voice-video'),
      shortcut: 'Ctrl+V'
    },
    {
      name: 'Invite People',
      description: 'Invite collaborators to session',
      icon: Icons.Share,
      action: () => onOpenModal('invite'),
      shortcut: 'Ctrl+I'
    }
  ]

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      action: () => setShowCommandPalette(true)
    },
    {
      key: 'p',
      ctrl: true,
      action: () => onOpenModal('upload')
    },
    {
      key: 's',
      ctrl: true,
      action: () => onOpenModal('download')
    },
    {
      key: 'd',
      ctrl: true,
      action: () => togglePreference('showFileTree')
    },
    {
      key: 'c',
      ctrl: true,
      action: () => togglePreference('showChatPanel')
    },
    {
      key: 'l',
      ctrl: true,
      action: () => setUseVirtualEditor(prev => !prev)
    },
    {
      key: 'i',
      ctrl: true,
      action: () => onOpenModal('invite')
    },
    {
      key: 'v',
      ctrl: true,
      action: () => onOpenModal('voice-video')
    }
  ])

  // Sync preferences with local state
  useEffect(() => {
    setShowChat(userPreferences.showChatPanel)
  }, [userPreferences.showChatPanel])

  useEffect(() => {
    setShowFileTree(userPreferences.showFileTree)
  }, [userPreferences.showFileTree])

  const files = {
    'index.js': code,
    'App.css': `/* Styles for your application */\n\n.app {\n  font-family: system-ui, sans-serif;\n  background: #1a1a1a;\n  color: white;\n}`,
    'README.md': `# CodeSync Project\n\nA real-time collaborative coding environment.\n\n## Features\n- Real-time editing\n- Team collaboration\n- File management`
  }

  const handleCodeChange = (newCode) => {
    setCode(newCode)
    addActivity('You edited the code')
    addToast('Code saved automatically', 'success', 2000)
  }

  const handleFileSelect = (filename) => {
    setActiveFile(filename)
    addToast(`Switched to ${filename}`, 'info', 1500)
    if (filename === 'index.js') {
      // Keep the current simulated code for index.js
    } else {
      setCode(files[filename] || '')
    }
  }

  const handleUserClick = (user) => {
    addActivity(`Highlighted ${user.name}'s cursor`)
    addToast(`Following ${user.name}`, 'info', 2000)
    simulateUserEdit(user.id)
    
    // Simulate cursor movement
    setUserCursors(prev => ({
      ...prev,
      [user.id]: {
        x: Math.random() * 500 + 50,
        y: Math.random() * 300 + 50,
        isTyping: true
      }
    }))

    // Stop typing after 2 seconds
    setTimeout(() => {
      setUserCursors(prev => ({
        ...prev,
        [user.id]: { ...prev[user.id], isTyping: false }
      }))
    }, 2000)
  }

  const handleTogglePreference = (key) => {
    togglePreference(key)
    addToast(`${key.replace('show', '').replace(/([A-Z])/g, ' $1')} ${userPreferences[key] ? 'hidden' : 'shown'}`, 'info')
  }

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null)
        setShowCommandPalette(false)
      }
    }
    
    const handleClickOutside = (e) => {
      if (activeModal && e.target.classList.contains('modal-overlay')) {
        setActiveModal(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [activeModal])

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <CommandPalette 
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        commands={commands}
      />

      {/* Updated Navbar with command palette trigger */}
      <Navbar 
        sessionId={sessionId}
        onLeaveSession={onLeaveSession}
        onOpenModal={onOpenModal}
        simulateLatency={simulateLatency}
        onLatencyToggle={() => setSimulateLatency(!simulateLatency)}
        userPreferences={userPreferences}
        onTogglePreference={handleTogglePreference}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* File Tree Sidebar */}
        <AnimatePresence>
          {showFileTree && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30 }}
              className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0"
            >
              {isLoading ? (
                <div className="p-4">
                  <FileTreeSkeleton />
                </div>
              ) : (
                <FileTree 
                  files={Object.keys(files)}
                  activeFile={activeFile}
                  onFileSelect={handleFileSelect}
                  isVisible={showFileTree}
                  onToggle={() => handleTogglePreference('showFileTree')}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex min-h-0">
            {/* Editor */}
            <div className="flex-1 flex flex-col min-w-0 relative">
              <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-300 font-mono">{activeFile}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    {code.length} chars
                  </div>
                  <button
                    onClick={() => setUseVirtualEditor(!useVirtualEditor)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                  >
                    {useVirtualEditor ? 'Virtual: ON' : 'Virtual: OFF'}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTogglePreference('showFileTree')}
                    className="p-1 text-gray-400 hover:text-white transition-colors rounded"
                    title={showFileTree ? 'Hide file tree' : 'Show file tree'}
                  >
                    {showFileTree ? '◀' : '▶'}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 relative min-h-0">
                {isLoading ? (
                  <div className="p-6">
                    <EditorSkeleton />
                  </div>
                ) : useVirtualEditor ? (
                  <VirtualizedEditor
                    code={code}
                    onChange={handleCodeChange}
                    language="javascript"
                  />
                ) : (
                  <>
                    <textarea
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="w-full h-full code-editor bg-gray-900 text-gray-100 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                      spellCheck="false"
                      placeholder="Start coding collaboratively..."
                    />
                    
                    {/* Live user cursors */}
                    {users.map(user => (
                      user.id !== 'local' && userCursors[user.id] && (
                        <UserCursor
                          key={user.id}
                          user={user}
                          position={userCursors[user.id]}
                          isTyping={userCursors[user.id]?.isTyping}
                        />
                      )
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Chat/Activity Panel */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: '200px' }}
                exit={{ height: 0 }}
                className="border-t border-gray-700 flex-shrink-0"
              >
                <ChatPanel 
                  activities={activities}
                  onSendMessage={addActivity}
                  onClose={() => {
                    handleTogglePreference('showChatPanel')
                    setShowChat(false)
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Toggle Button */}
      {!showChat && (
        <button
          onClick={() => {
            handleTogglePreference('showChatPanel')
            setShowChat(true)
          }}
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 p-3 rounded-full shadow-lg transition-colors z-30"
        >
          <Icons.Message className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Command Palette Trigger */}
      <button
        onClick={() => setShowCommandPalette(true)}
        className="fixed bottom-4 left-4 bg-gray-700 hover:bg-gray-600 p-3 rounded-full shadow-lg transition-colors z-30 flex items-center space-x-2"
      >
        <Icons.Search className="w-5 h-5 text-white" />
        <kbd className="text-xs bg-gray-600 px-2 py-1 rounded border border-gray-500 text-gray-300">Ctrl+K</kbd>
      </button>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'invite' && (
          <InviteModal 
            sessionId={sessionId}
            onClose={() => setActiveModal(null)}
          />
        )}
        
        {activeModal === 'upload' && (
          <UploadModal onClose={() => setActiveModal(null)} />
        )}
        
        {activeModal === 'download' && (
          <DownloadModal 
            files={files}
            onClose={() => setActiveModal(null)}
          />
        )}
        
        {activeModal === 'voice-video' && (
          <VoiceVideoModal onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default EditorPage