import { useState, useEffect, useCallback } from 'react'
import { 
  generateMockUsers, 
  generateActivityMessage, 
  generateMockEdit,
  simulateLatency 
} from '../utils/simulation'

const useSimulatedUsers = (sessionId) => {
  const [users, setUsers] = useState([
    {
      id: 'local',
      name: 'You',
      avatar: 'Y',
      color: '#3B82F6',
      isTyping: false
    }
  ])
  
  const [activities, setActivities] = useState([
    `Session ${sessionId} started`,
    'You joined the session'
  ])

  const [code, setCode] = useState('// Welcome to CodeSync!\n// Start coding with your team...\n\nfunction helloWorld() {\n  console.log("Hello, CodeSync!");\n}')

  const addActivity = useCallback((message) => {
    setActivities(prev => [...prev.slice(-49), message]) // Keep last 50 activities
  }, [])

  const simulateUserEdit = useCallback(async (userId, simulateDelay = false) => {
    const user = users.find(u => u.id === userId)
    if (user && user.id !== 'local') {
      // Simulate network latency if enabled
      if (simulateDelay) {
        await simulateLatency(500, 1500)
      }
      
      // Generate realistic edit
      const newCode = generateMockEdit(code)
      setCode(newCode)
      
      // Add activity message
      addActivity(generateActivityMessage(user.name, 'edited'))
      
      // Simulate typing indicator
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isTyping: true } : u
      ))
      
      setTimeout(() => {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isTyping: false } : u
        ))
      }, 2000)
    }
  }, [users, code, addActivity])

  // Initialize simulated users - FIXED: Only add once
  useEffect(() => {
    const simulatedUsers = generateMockUsers(2)
    
    // Only add if not already added
    setUsers(prev => {
      const existingUserIds = new Set(prev.map(u => u.id))
      const newUsers = simulatedUsers.filter(user => !existingUserIds.has(user.id))
      return [...prev, ...newUsers]
    })
    
    // Add initial activities for simulated users
    simulatedUsers.forEach(user => {
      addActivity(`${user.name} joined the session`)
    })
  }, [addActivity])

  // Simulate random user activities and edits
  useEffect(() => {
    const interval = setInterval(() => {
      const remoteUsers = users.filter(u => u.id !== 'local')
      if (remoteUsers.length > 0) {
        const randomUser = remoteUsers[Math.floor(Math.random() * remoteUsers.length)]
        const actionTypes = ['edit', 'comment', 'review']
        const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)]
        
        if (actionType === 'edit') {
          simulateUserEdit(randomUser.id, true)
        } else {
          addActivity(generateActivityMessage(randomUser.name, actionType))
        }
      }
    }, 8000) // Every 8 seconds

    return () => clearInterval(interval)
  }, [users, addActivity, simulateUserEdit])

  // Simulate cursor movements
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setUsers(prev => prev.map(user => 
        user.id !== 'local' 
          ? { ...user, lastCursorMove: Date.now() }
          : user
      ))
    }, 3000)

    return () => clearInterval(cursorInterval)
  }, [])

  return {
    users,
    activities,
    code,
    setCode,
    addActivity,
    simulateUserEdit
  }
}

export default useSimulatedUsers