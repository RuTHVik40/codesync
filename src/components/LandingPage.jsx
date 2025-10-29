import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Icons from './Icons'

const LandingPage = ({ onCreateSession, onJoinSession, currentUser, onOpenLogin }) => {
  const [joinSessionId, setJoinSessionId] = useState('')

  const features = [
    {
      title: "Real-time Collaboration",
      description: "Code together simultaneously with live cursor tracking and instant updates",
      icon: Icons.Users
    },
    {
      title: "File Management",
      description: "Upload, download, and manage project files with built-in version control",
      icon: Icons.Folder
    },
    {
      title: "Team Communication",
      description: "Built-in chat, voice, and video for seamless team collaboration",
      icon: Icons.Message
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icons.Code className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CodeSync</span>
          </div>
          
          {/* User info or login prompt */}
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-300">
                Welcome back, <span className="font-semibold text-blue-400">{currentUser.name}</span>!
              </div>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: currentUser.color }}
              >
                {currentUser.avatar}
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition-colors" // Smaller button
            >
              <Icons.User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
  CodeSync
</h1>

            <p className="text-xl text-gray-300 mb-6 font-light">
              Collaborate. Code. Sync in Real Time.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              The ultimate remote pair programming environment. Code together in real-time with your team, 
              no matter where you are. Professional tools for professional developers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-8"> {/* Reduced gap to gap-3 */}
              {/* Create Session Button - Smaller */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateSession}
                className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors" // Smaller padding and text
              >
                <Icons.Code className="w-4 h-4" /> {/* Smaller icon */}
                <span>Create Session</span>
              </motion.button>
              
              {/* Join Session Section - Smaller */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Session ID"
                  value={joinSessionId}
                  onChange={(e) => setJoinSessionId(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 flex-1 min-w-0" // Smaller padding and text
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onJoinSession(joinSessionId)}
                  className="flex items-center space-x-2 px-3 py-2.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors whitespace-nowrap" // Smaller padding and text
                >
                  <Icons.Users className="w-3.5 h-3.5" /> {/* Smaller icon */}
                  <span>Join Session</span>
                </motion.button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-700"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100 mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Editor Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-4 shadow-2xl border border-gray-700 mt-4"
          >
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              {/* Editor Header */}
              <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-300 font-mono">index.js</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Icons.Users className="w-3 h-3" />
                    <span>2 online</span>
                  </div>
                </div>
              </div>

              {/* Code Preview */}
              <div className="p-4 font-mono text-sm text-gray-300">
                <div className="text-gray-500">// Welcome to CodeSync</div>
                <div className="text-gray-500 mb-3">// Professional pair programming</div>
                
                <div className="text-purple-400">function</div>
                <div className="ml-4">
                  <span className="text-blue-400">helloWorld</span>
                  <span className="text-gray-300">() {'{'}</span>
                </div>
                <div className="ml-8 text-green-400">console</div>
                <div className="ml-12">
                  <span className="text-gray-300">.</span>
                  <span className="text-yellow-400">log</span>
                  <span className="text-gray-300">(</span>
                  <span className="text-green-600">'Hello, CodeSync!'</span>
                  <span className="text-gray-300">)</span>
                </div>
                <div className="ml-4 text-gray-300">{'}'}</div>
                
                <div className="mt-4 flex items-center space-x-3 p-3 bg-blue-900 bg-opacity-20 rounded border border-blue-800 border-opacity-30">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="text-blue-400 text-xs">2 collaborators editing</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Additional Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-200 mb-8">Why Choose CodeSync?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icons.Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Real-time Editing</h3>
              <p className="text-gray-400 text-sm">See changes as they happen with live collaboration</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icons.Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Team Collaboration</h3>
              <p className="text-gray-400 text-sm">Work together seamlessly with built-in communication</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icons.Folder className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">File Management</h3>
              <p className="text-gray-400 text-sm">Organize and manage your projects efficiently</p>
            </div>
          </div>
        </div>
      </div>

      {/* More content */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-200 mb-8">Get Started Today</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using CodeSync to collaborate, 
            learn, and build amazing projects together.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateSession}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors" // Smaller button
          >
            Start Coding Now
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage