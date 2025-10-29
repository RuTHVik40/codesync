import React from 'react'
import { motion } from 'framer-motion'
import Icons from '../Icons'

const DownloadModal = ({ files, onClose }) => {
  const handleDownload = async () => {
    try {
      // Simulate ZIP creation and download
      const blob = new Blob([JSON.stringify(files, null, 2)], { type: 'application/zip' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `codesync-session-${Date.now()}.txt` // Simulated ZIP as txt
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('Download started! (Simulated as .txt file)')
      onClose()
    } catch (error) {
      alert('Download failed: ' + error.message)
    }
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
          <Icons.Download className="w-5 h-5" />
          <span>Download Project</span>
        </h2>
        
        <div className="space-y-4">
          <div className="bg-gray-750 rounded-lg p-4">
            <div className="text-sm text-gray-300 mb-2">Files to include:</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.keys(files).map((filename, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <Icons.File className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-200">{filename}</span>
                  <span className="text-gray-400 text-xs">
                    ({files[filename].length} chars)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <input type="checkbox" id="include-git" className="rounded" />
            <label htmlFor="include-git">Include .gitignore file</label>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <input type="checkbox" id="minify" className="rounded" />
            <label htmlFor="minify">Minify code files</label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
          >
            Download ZIP
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DownloadModal