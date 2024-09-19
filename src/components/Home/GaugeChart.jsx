import { ChevronRight } from 'lucide-react'
import React from 'react'

const GaugeChart = ({ score = 4.18, maxScore = 5 }) => {
  const percentage = (score / maxScore) * 100
  const radius = 120
  const strokeWidth = 30
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-auto'>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>
        Objetivos del Mes
      </h2>
      <div className='relative'>
        <svg
          className='w-full h-auto'
          viewBox={`0 0 ${radius * 2} ${radius + strokeWidth / 2}`}
        >
          <circle
            className='text-gray-200'
            strokeWidth={strokeWidth}
            stroke='currentColor'
            fill='transparent'
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap='round'
          />
          <circle
            className='text-blue-500 transition-all duration-1000 ease-in-out'
            strokeWidth={strokeWidth}
            stroke='currentColor'
            fill='transparent'
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap='round'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-180 ${radius} ${radius})`}
          />
          <text
            x='50%'
            y={radius + 5}
            textAnchor='middle'
            className='text-3xl font-bold fill-gray-700'
          >
            {score.toFixed(2)}/{maxScore}
          </text>
          <text
            x='50%'
            y={radius - 25}
            textAnchor='middle'
            className='text-sm fill-gray-500'
          >
            Total Score
          </text>
        </svg>
      </div>
      <p className='text-sm text-gray-600 text-center mt-4 mb-6'>
        Mejora tu servicio para aumentar la puntuación de satisfacción del
        cliente
      </p>
      <button className='w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-300 flex items-center justify-center group'>
        See Customer Reviews
        <ChevronRight
          className='ml-2 group-hover:translate-x-1 transition-transform duration-300'
          size={20}
        />
      </button>
    </div>
  )
}

export default GaugeChart
