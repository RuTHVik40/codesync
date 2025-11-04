import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../../contexts/UserContext'
import Icons from '../Icons'

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const { login } = useUser()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'developer'
  })
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = isCreatingAccount
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login"
      const payload = isCreatingAccount
        ? { username: formData.name, email: formData.email, password: formData.password, role: formData.role }
        : { username: formData.name || formData.email, password: formData.password }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.msg || 'Authentication failed')
      } else {
        // Save token for API and socket use
        localStorage.setItem('token', data.token)
        login(data.user, data.token)
        onLoginSuccess?.()
        onClose()
      }
    } catch (err) {
      setError('Network error')
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <motion.div className="bg-gray-800 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">
          {isCreatingAccount ? 'Create Account' : 'Welcome to CodeSync'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name or Email
            </label>
            <input
              type={isCreatingAccount ? "text" : "text"}
              name={isCreatingAccount ? "name" : "name"}
              value={isCreatingAccount ? formData.name : formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              placeholder={isCreatingAccount ? "Enter your name" : "Name or email"}
            />
          </div>
          <div>
            {isCreatingAccount && (
              <>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
                  placeholder="Email"
                />
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="Password"
            />
          </div>
          {isCreatingAccount && (
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
          )}
          {error && <div className="text-red-400 text-xs">{error}</div>}
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setIsCreatingAccount(!isCreatingAccount)} className="text-sm text-blue-400 hover:text-blue-300">
              {isCreatingAccount ? 'Already have an account?' : 'Create new account'}
            </button>
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
              {loading ? 'Processing...' : isCreatingAccount ? 'Create Account' : 'Login'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default LoginModal
