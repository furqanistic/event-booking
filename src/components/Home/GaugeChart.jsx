import React from 'react'

const GaugeChart = ({ percentage = 75 }) => {
  const radius = 80
  const strokeWidth = 20
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className='flex justify-center items-center bg-white rounded-lg shadow-md p-4'>
      <svg
        height={radius * 2}
        width={radius * 2}
        className='transform -rotate-90'
      >
        <circle
          stroke='#e6e6e6'
          fill='transparent'
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke='#fbbf24'
          fill='transparent'
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x='50%'
          y='50%'
          dy='.3em'
          textAnchor='middle'
          className='text-3xl font-bold fill-current text-gray-700 transform rotate-90'
        >
          {`${percentage}%`}
        </text>
      </svg>
    </div>
  )
}

export default GaugeChart
