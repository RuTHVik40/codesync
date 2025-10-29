import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../../contexts/UserContext'
import Icons from '../Icons'

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const { login } = useUser()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'developer'
  })
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim() && formData.email.trim()) {
      login(formData)
      onLoginSuccess?.()
      onClose()
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const quickLogin = (userType) => {
    const quickUsers = {
      developer: { name: 'Alex Developer', email: 'alex@example.com', role: 'developer' },
      designer: { name: 'Sam Designer', email: 'sam@example.com', role: 'designer' },
      manager: { name: 'Taylor Manager', email: 'taylor@example.com', role: 'manager' }
    }
    
    login(quickUsers[userType])
    onLoginSuccess?.()
    onClose()
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
        <h2 className="text-xl font-bold mb-4">
          {isCreatingAccount ? 'Create Account' : 'Welcome to CodeSync'}
        </h2>

        {/* Quick Login Buttons */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-3">Quick login as:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => quickLogin('developer')}
              className="flex flex-col items-center p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
            >
              <Icons.Code className="w-5 h-5 mb-1" />
              <span>Developer</span>
            </button>
            <button
              onClick={() => quickLogin('designer')}
              className="flex flex-col items-center p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
            >
              <Icons.Edit className="w-5 h-5 mb-1" />
              <span>Designer</span>
            </button>
            <button
              onClick={() => quickLogin('manager')}
              className="flex flex-col items-center p-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
            >
              <Icons.Users className="w-5 h-5 mb-1" />
              <span>Manager</span>
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">Or enter details</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            >
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsCreatingAccount(!isCreatingAccount)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {isCreatingAccount ? 'Already have an account?' : 'Create new account'}
            </button>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              {isCreatingAccount ? 'Create Account' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-gray-750 rounded text-xs text-gray-400">
          <p>This is a simulation. In a real app, this would connect to a backend authentication service.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LoginModal