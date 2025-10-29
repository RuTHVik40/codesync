import { useState, useEffect, useRef } from 'react'

export const useDropdownPosition = () => {
  const [position, setPosition] = useState({})
  const triggerRef = useRef(null)
  const dropdownRef = useRef(null)

  const calculatePosition = () => {
    if (!triggerRef.current) return {}

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const dropdownWidth = 320 // Approximate dropdown width
    const dropdownHeight = 400 // Approximate dropdown height

    let top = triggerRect.bottom + 8
    let right = viewportWidth - triggerRect.right
    let positionClass = ''

    // Check if dropdown would go off-screen at the bottom
    if (triggerRect.bottom + dropdownHeight > viewportHeight) {
      // Position above the trigger
      top = triggerRect.top - dropdownHeight - 8
      positionClass = 'bottom-full'
    }

    // Check if dropdown would go off-screen on the right
    if (triggerRect.right + dropdownWidth > viewportWidth) {
      right = viewportWidth - triggerRect.right - dropdownWidth + triggerRect.width
    }

    // Check if dropdown would go off-screen on the left
    if (triggerRect.left - dropdownWidth < 0) {
      right = viewportWidth - triggerRect.right + dropdownWidth - triggerRect.width
    }

    return {
      position: 'fixed',
      top: `${top}px`,
      right: `${right}px`,
      zIndex: 50,
      positionClass
    }
  }

  useEffect(() => {
    const updatePosition = () => {
      setPosition(calculatePosition())
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [])

  return { triggerRef, dropdownRef, position }
}