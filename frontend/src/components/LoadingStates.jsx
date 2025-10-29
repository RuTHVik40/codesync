import React from 'react';
import { motion } from 'framer-motion';

export const SessionLoading = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
  </div>
);

export const EditorSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-700 rounded mb-4"></div>
    <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
    <div className="h-4 bg-gray-700 rounded mb-2 w-1/2"></div>
    <div className="h-4 bg-gray-700 rounded mb-2 w-5/6"></div>
    <div className="h-4 bg-gray-700 rounded mb-2 w-2/3"></div>
  </div>
);

export const FileTreeSkeleton = () => (
  <div className="animate-pulse space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-700 rounded flex-1" style={{ width: `${Math.random() * 100 + 50}px` }}></div>
      </div>
    ))}
  </div>
);