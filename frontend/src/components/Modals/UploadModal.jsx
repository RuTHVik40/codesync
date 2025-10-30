import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Icons from '../Icons'

const UploadModal = ({ onClose }) => {
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    // Simulate file processing
    const processedFiles = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.name.split('.').pop().toUpperCase()
    }))
    setUploadedFiles(processedFiles)
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
          <Icons.Upload className="w-5 h-5" />
          <span>Upload Files</span>
        </h2>
        
        <div className="space-y-4">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer block"
            >
              <Icons.Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <div className="text-gray-300 mb-1">Click to upload files</div>
              <div className="text-sm text-gray-400">or drag and drop</div>
              <div className="text-xs text-gray-500 mt-2">Supports all code files</div>
            </label>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-300 mb-2">Selected Files:</h3>
              <div className="bg-gray-750 rounded-lg p-3 max-h-48 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <Icons.File className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-200">{file.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {file.size} • {file.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert('Files uploaded successfully! (Simulated)')
              onClose()
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
            disabled={uploadedFiles.length === 0}
          >
            Upload Files
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default UploadModal