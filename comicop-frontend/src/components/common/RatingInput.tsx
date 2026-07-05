import React, { useState } from 'react'

interface RatingInputProps {
  value: number
  onChange: (rating: number) => void
}

// Component chọn sao 1-5 — click để chọn, hover để preview
const RatingInput: React.FC<RatingInputProps> = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className="text-2xl transition-colors focus:outline-none"
        >
          <span className={
            star <= (hoverValue || value)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }>
            ★
          </span>
        </button>
      ))}
    </div>
  )
}

export default RatingInput