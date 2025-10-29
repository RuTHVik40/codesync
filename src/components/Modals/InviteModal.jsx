import React from 'react'
import { motion } from 'framer-motion'
import Icons from '../Icons'

const InviteModal = ({ sessionId, onClose }) => {
  const inviteLink = `${window.location.origin}/session/${sessionId}`

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Would normally show a toast notification
    alert('Copied to clipboard!')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <Icons.Share className="w-5 h-5" />
          <span>Invite Collaborators</span>
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Session ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={sessionId}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(sessionId)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                <Icons.Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Invite Link
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm"
              />
              <button
                onClick={() => copyToClipboard(inviteLink)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
              >
                <Icons.Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default InviteModal