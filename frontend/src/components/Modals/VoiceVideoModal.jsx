import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Icons from '../Icons'

const VoiceVideoModal = ({ onClose }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  const participants = [
    { id: 1, name: 'You', isLocal: true, audio: isAudioEnabled, video: isVideoEnabled },
    { id: 2, name: 'Alex Johnson', isLocal: false, audio: true, video: true },
    { id: 3, name: 'Sam Chen', isLocal: false, audio: true, video: false },
  ]

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
        className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Icons.Video className="w-5 h-5" />
            <span>Voice & Video Call</span>
          </h2>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video Grid */}
            <div className="col-span-1 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {participants.map((participant) => (
                  <div key={participant.id} className="bg-gray-750 rounded-lg p-4 aspect-video">
                    <div className="h-full flex items-center justify-center relative">
                      {/* Video Placeholder or Feed */}
                      {participant.video ? (
                        <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                          <div className="text-center">
                            <Icons.Video className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <div className="text-sm text-gray-300">{participant.name}</div>
                            {participant.isLocal && <div className="text-xs text-blue-400">You</div>}
                          </div>
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                          <Icons.User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Audio Indicator */}
                      {participant.audio && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                      
                      {/* Name Tag */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
                        {participant.name}
                        {participant.isLocal && ' (You)'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participants List */}
            <div className="col-span-1">
              <h3 className="font-medium text-gray-300 mb-3 flex items-center space-x-2">
                <Icons.Users className="w-4 h-4" />
                <span>Participants ({participants.length})</span>
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-750 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <Icons.User className="w-4 h-4 text-gray-300" />
                      </div>
                      <span className="text-sm text-gray-200">{participant.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      {participant.audio && <Icons.Mic className="w-4 h-4 text-green-400" />}
                      {participant.video && <Icons.Video className="w-4 h-4 text-blue-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="col-span-1">
              <h3 className="font-medium text-gray-300 mb-3 flex items-center space-x-2">
                <Icons.Settings className="w-4 h-4" />
                <span>Settings</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Microphone</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white">
                    <option>Default Microphone</option>
                    <option>Microphone 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Camera</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white">
                    <option>Default Camera</option>
                    <option>Camera 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Speaker</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white">
                    <option>Default Speaker</option>
                    <option>Speaker 2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="col-span-1 md:col-span-2 mt-6">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-3 rounded-full transition-colors ${
                  isAudioEnabled ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                <Icons.Mic className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-3 rounded-full transition-colors ${
                  isVideoEnabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <Icons.Video className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-full transition-colors ${
                  isScreenSharing ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <Icons.Maximize className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-red-600 rounded-full">
                <Icons.Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className="p-4 border-t border-gray-700 flex justify-end flex-shrink-0">
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

export default VoiceVideoModal