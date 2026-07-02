import React, { useState, useEffect } from 'react'

// Nút mũi tên lên đầu trang — hiện khi cuộn xuống quá 300px
const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Hiện nút khi cuộn xuống quá 300px
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40
        w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg
        hover:bg-indigo-700 active:bg-indigo-800
        transition-all duration-300 hover:scale-110
        flex items-center justify-center"
      title="Lên đầu trang"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  )
}

export default ScrollToTop