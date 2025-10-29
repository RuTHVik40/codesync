import React, { useState, useMemo } from 'react';
import { FixedSizeList } from 'react-window';

const VirtualizedEditor = ({ code, onChange, language = 'javascript' }) => {
  const lines = useMemo(() => code.split('\n'), [code]);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const Line = ({ index, style }) => {
    const lineNumber = index + 1;
    const lineContent = lines[index] || '';
    const isSelected = index >= selection.start && index <= selection.end;

    const handleClick = () => {
      setSelection({ start: index, end: index });
    };

    return (
      <div 
        style={style} 
        className={`flex font-mono text-sm hover:bg-gray-800 ${
          isSelected ? 'bg-blue-900 bg-opacity-30' : ''
        }`}
        onClick={handleClick}
      >
        <div className="w-12 text-right pr-3 text-gray-500 select-none border-r border-gray-700 flex-shrink-0 flex items-center justify-end">
          {lineNumber}
        </div>
        <div className="flex-1 pl-3 whitespace-pre overflow-x-auto flex items-center">
          {lineContent}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-900 text-gray-100">
      <FixedSizeList
        height={600}
        itemCount={lines.length}
        itemSize={24}
        width="100%"
      >
        {Line}
      </FixedSizeList>
    </div>
  );
};

export default VirtualizedEditor;