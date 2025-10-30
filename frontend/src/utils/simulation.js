// Simulation utilities for mock real-time behavior

/**
 * Generates random user data for simulation
 */
export const generateMockUsers = (count = 2) => {
  const names = ['Alex Johnson', 'Sam Chen', 'Taylor Swift', 'Jordan Lee', 'Casey Smith', 'Riley Brown']
  const colors = ['#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4', '#EC4899']
  const avatars = ['A', 'S', 'T', 'J', 'C', 'R']
  
  return Array.from({ length: count }, (_, index) => {
    const nameIndex = index % names.length
    return {
      id: `user${index + 1}`,
      name: names[nameIndex],
      avatar: avatars[nameIndex],
      color: colors[nameIndex % colors.length],
      isTyping: false,
      lastActivity: Date.now() - Math.random() * 60000 // Random activity within last minute
    }
  })
}

/**
 * Simulates network latency
 */
export const simulateLatency = (minDelay = 0, maxDelay = 1000) => {
  return new Promise(resolve => {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay
    setTimeout(resolve, delay)
  })
}

/**
 * Generates realistic code edits for simulation
 */
export const generateMockEdit = (currentCode) => {
  const lines = currentCode.split('\n')
  const editTypes = ['insert', 'delete', 'modify', 'comment']
  const editType = editTypes[Math.floor(Math.random() * editTypes.length)]
  
  const lineNumber = Math.floor(Math.random() * Math.min(lines.length, 20)) // Don't go too far down
  
  switch (editType) {
    case 'insert':
      const insertions = [
        `  console.log("Debug: ${Math.random().toString(36).substring(7)}")`,
        `  // TODO: Implement this feature`,
        `  const tempVar = ${Math.floor(Math.random() * 100)}`,
        `  if (condition) { return true }`,
        `  try { /* code */ } catch (error) { console.error(error) }`
      ]
      lines.splice(lineNumber, 0, insertions[Math.floor(Math.random() * insertions.length)])
      break
      
    case 'delete':
      if (lines.length > 3 && lineNumber > 0 && lineNumber < lines.length - 1) {
        lines.splice(lineNumber, 1)
      }
      break
      
    case 'modify':
      if (lines[lineNumber]) {
        const modifications = [
          line => line.replace('const', 'let'),
          line => line.replace('function', 'async function'),
          line => line + ' // modified',
          line => line.replace(/=.*/, `= ${Math.random() * 100}`),
          line => line.replace(/".*"/, `"updated_${Date.now()}"`)
        ]
        const modifier = modifications[Math.floor(Math.random() * modifications.length)]
        lines[lineNumber] = modifier(lines[lineNumber])
      }
      break
      
    case 'comment':
      if (lines[lineNumber] && !lines[lineNumber].trim().startsWith('//')) {
        lines[lineNumber] = `// ${lines[lineNumber]}`
      }
      break
  }
  
  return lines.join('\n')
}

/**
 * Generates realistic activity messages
 */
export const generateActivityMessage = (userName, action = null) => {
  const actions = action ? [action] : [
    'edited line',
    'commented on',
    'refactored',
    'added function to',
    'fixed bug in',
    'optimized'
  ]
  
  const files = ['index.js', 'App.css', 'utils.js', 'components/Editor.jsx', 'package.json']
  const components = ['header component', 'editor logic', 'styles', 'utility functions']
  
  const actionType = actions[Math.floor(Math.random() * actions.length)]
  const target = Math.random() > 0.5 
    ? files[Math.floor(Math.random() * files.length)]
    : components[Math.floor(Math.random() * components.length)]
  
  const lineNumber = Math.floor(Math.random() * 50) + 1
  
  return `${userName} ${actionType} ${target}${actionType.includes('line') ? ` ${lineNumber}` : ''}`
}

/**
 * Simulates cursor movement positions
 */
export const generateCursorPosition = (editorWidth = 800, editorHeight = 600) => {
  return {
    x: Math.floor(Math.random() * (editorWidth - 100)) + 50, // Avoid edges
    y: Math.floor(Math.random() * (editorHeight - 100)) + 50,
    timestamp: Date.now()
  }
}

/**
 * Creates a realistic file tree structure
 */
export const generateFileTree = () => {
  return {
    'src': {
      type: 'folder',
      children: {
        'components': {
          type: 'folder',
          children: {
            'Editor.jsx': { type: 'file', language: 'javascript' },
            'Sidebar.jsx': { type: 'file', language: 'javascript' },
            'ChatPanel.jsx': { type: 'file', language: 'javascript' }
          }
        },
        'utils': {
          type: 'folder',
          children: {
            'simulation.js': { type: 'file', language: 'javascript' },
            'helpers.js': { type: 'file', language: 'javascript' }
          }
        },
        'App.jsx': { type: 'file', language: 'javascript' },
        'index.js': { type: 'file', language: 'javascript' }
      }
    },
    'public': {
      type: 'folder',
      children: {
        'index.html': { type: 'file', language: 'html' },
        'favicon.ico': { type: 'file', language: 'image' }
      }
    },
    'package.json': { type: 'file', language: 'json' },
    'README.md': { type: 'file', language: 'markdown' }
  }
}

/**
 * Simulates file content based on file type
 */
export const generateFileContent = (filename) => {
  const extension = filename.split('.').pop()
  
  const templates = {
    js: `// ${filename}
import React from 'react'

export const ${filename.split('.')[0]} = () => {
  return (
    <div>
      <h1>${filename}</h1>
      <p>Generated content for simulation</p>
    </div>
  )
}

export default ${filename.split('.')[0]}
`,
    jsx: `// ${filename}
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const ${filename.split('.')[0]} = ({ children }) => {
  const [isActive, setIsActive] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="component"
    >
      {children}
    </motion.div>
  )
}

export default ${filename.split('.')[0]}
`,
    css: `/* ${filename} */
.container {
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  color: white;
  font-family: system-ui, sans-serif;
}

.component {
  padding: 1rem;
  border-radius: 0.5rem;
  background: #2d2d2d;
}
`,
    json: `{
  "name": "${filename.split('.')[0]}",
  "version": "1.0.0",
  "description": "Generated configuration file",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
`,
    md: `# ${filename.split('.')[0]}

This is a generated markdown file for simulation purposes.

## Features

- Feature 1
- Feature 2
- Feature 3

## Usage

\`\`\`javascript
console.log("Hello World")
\`\`\`
`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename.split('.')[0]}</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #1a1a1a;
      color: white;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
`
  }
  
  return templates[extension] || `// ${filename}\n// File content would go here\n`
}

/**
 * Creates mock WebSocket-like behavior for simulation
 */
export class MockWebSocket {
  constructor(url) {
    this.url = url
    this.readyState = 1 // OPEN
    this.onopen = null
    this.onmessage = null
    this.onclose = null
    this.onerror = null
    
    // Simulate connection establishment
    setTimeout(() => {
      if (this.onopen) this.onopen({ type: 'open' })
    }, 100)
    
    // Simulate incoming messages
    this.messageInterval = setInterval(() => {
      if (this.onmessage && Math.random() > 0.7) {
        const mockUsers = generateMockUsers(1)
        const message = {
          data: JSON.stringify({
            type: 'user_activity',
            user: mockUsers[0],
            activity: generateActivityMessage(mockUsers[0].name),
            timestamp: Date.now()
          })
        }
        this.onmessage(message)
      }
    }, 5000)
  }
  
  send(data) {
    console.log('MockWebSocket send:', data)
    // Simulate network delay
    setTimeout(() => {
      if (this.onmessage) {
        const response = {
          data: JSON.stringify({
            type: 'ack',
            original: JSON.parse(data),
            timestamp: Date.now(),
            status: 'success'
          })
        }
        this.onmessage(response)
      }
    }, Math.random() * 200 + 50)
  }
  
  close() {
    this.readyState = 3 // CLOSED
    clearInterval(this.messageInterval)
    if (this.onclose) {
      this.onclose({ type: 'close' })
    }
  }
}

/**
 * Simulates file upload processing
 */
export const simulateFileUpload = (files) => {
  return new Promise((resolve) => {
    const processedFiles = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type || file.name.split('.').pop().toUpperCase(),
      status: 'uploaded',
      uploadedAt: new Date().toISOString()
    }))
    
    // Simulate upload delay
    setTimeout(() => {
      resolve({
        success: true,
        files: processedFiles,
        message: `Successfully uploaded ${files.length} files`
      })
    }, 1500)
  })
}

/**
 * Simulates file download preparation
 */
export const simulateFileDownload = (files) => {
  return new Promise((resolve) => {
    // Simulate ZIP creation delay
    setTimeout(() => {
      resolve({
        success: true,
        downloadUrl: 'blob:mock-download-url',
        size: files.reduce((acc, file) => acc + (parseFloat(file.size) || 0), 0) + ' KB',
        fileCount: files.length
      })
    }, 2000)
  })
}

/**
 * Color utility for consistent user colors
 */
export const getUserColor = (userId) => {
  const colors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', 
    '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#8B5CF6'
  ]
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
}

export default {
  generateMockUsers,
  simulateLatency,
  generateMockEdit,
  generateActivityMessage,
  generateCursorPosition,
  generateFileTree,
  generateFileContent,
  MockWebSocket,
  simulateFileUpload,
  simulateFileDownload,
  getUserColor
}