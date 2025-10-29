import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check for Ctrl/Cmd + key combinations
      if (event.ctrlKey || event.metaKey) {
        const shortcut = shortcuts.find(s => 
          s.key.toLowerCase() === event.key.toLowerCase() && 
          s.ctrl === true
        );
        
        if (shortcut) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
      
      // Check for regular key combinations
      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        const shortcut = shortcuts.find(s => 
          s.key.toLowerCase() === event.key.toLowerCase() && 
          !s.ctrl
        );
        
        if (shortcut) {
          event.preventDefault();
          shortcut.action();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts]);
};