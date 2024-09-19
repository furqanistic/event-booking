import { ArrowUpRight } from 'lucide-react'
import React, { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const generateData = (period) => {
  const currentDate = new Date()
  const data = []
  let startDate, endDate, dateFormat

  switch (period) {
    case 'day':
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 29
      )
      endDate = currentDate
      dateFormat = { day: '2-digit', month: 'short' }
      break
    case 'week':
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 11,
        1
      )
      endDate = currentDate
      dateFormat = { day: '2-digit', month: 'short' }
      break
    case 'month':
      startDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth() + 1,
        1
      )
      endDate = currentDate
      dateFormat = { month: 'short' }
      break
    case 'year':
      startDate = new Date(currentDate.getFullYear() - 4, 0, 1)
      endDate = currentDate
      dateFormat = { year: 'numeric' }
      break
  }

  let currentDataPoint = new Date(startDate)
  while (currentDataPoint <= endDate) {
    const formattedDate = currentDataPoint.toLocaleDateString(
      'es-ES',
      dateFormat
    )

    // Only add the data point if it's a new unique date
    if (!data.some((item) => item.date === formattedDate)) {
      data.push({
        date: formattedDate,
        series1: Math.floor(Math.random() * 10000) + 5000,
        series2: Math.floor(Math.random() * 8000) + 4000,
      })
    }

    // Increment the date based on the period
    switch (period) {
      case 'day':
        currentDataPoint.setDate(currentDataPoint.getDate() + 1)
        break
      case 'week':
        currentDataPoint.setDate(currentDataPoint.getDate() + 7)
        break
      case 'month':
        currentDataPoint.setMonth(currentDataPoint.getMonth() + 1)
        break
      case 'year':
        currentDataPoint.setFullYear(currentDataPoint.getFullYear() + 1)
        break
    }
  }

  return data
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-indigo-900 text-white p-3 rounded-lg shadow-lg'>
        <p className='text-sm font-semibold mb-2'>{label}</p>
        {payload.map((pld, index) => (
          <p key={index} className='text-sm'>
            Promedio {index + 1}: {pld.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const EventsLineChart = () => {
  const [period, setPeriod] = useState('month')
  const data = generateData(period)

  const percentageChange = (
    ((data[data.length - 1].series1 - data[0].series1) / data[0].series1) *
    100
  ).toFixed(2)

  return (
    <div className='bg-white p-4 sm:p-6 rounded-xl shadow-lg my-5'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2 sm:mb-0'>
          Eventos
        </h2>
        <div className='flex items-center space-x-2 text-sm text-green-500'>
          <ArrowUpRight size={16} />
          <span>{percentageChange}% Last period</span>
        </div>
      </div>
      <div className='flex flex-wrap gap-2 mb-6'>
        {['day', 'week', 'month', 'year'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              period === p
                ? 'text-white bg-blue-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
      <div className='h-64 sm:h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
              stroke='#f0f0f0'
            />
            <XAxis
              dataKey='date'
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              interval={'preserveStartEnd'}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type='monotone'
              dataKey='series1'
              stroke='#3B82F6'
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8 }}
            />
            <Line
              type='monotone'
              dataKey='series2'
              stroke='#93C5FD'
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default EventsLineChart
