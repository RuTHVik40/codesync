import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icons from './Icons'

const ChatPanel = ({ activities, onSendMessage, onClose }) => {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activities])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(`You: ${message}`)
      setMessage('')
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-750 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Icons.Message className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-gray-200">Chat & Activity</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 transition-colors"
        >
          <Icons.Close className="w-4 h-4" />
        </button>
      </div>

      {/* Messages - Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        <AnimatePresence>
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors border border-gray-600"
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-gray-200 flex-1">
                  {activity}
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed at Bottom, Always Visible */}
      <div className="p-3 border-t border-gray-700 bg-gray-800 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-sm text-white placeholder-gray-400"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Icons.Message className="w-4 h-4" />
            <span>Send</span>
          </motion.button>
        </form>
      </div>
    </div>
  )
}

export default ChatPanel