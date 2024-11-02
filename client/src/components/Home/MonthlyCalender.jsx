import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

const MonthlyCalendar = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const events = [
    { date: 5, type: 'important', title: 'Team Meeting', time: '10:00 AM' },
    { date: 12, type: 'regular', title: 'Workshop', time: '2:00 PM' },
    { date: 15, type: 'special', title: 'Conference', time: '9:00 AM' },
    { date: 23, type: 'important', title: 'Review', time: '3:30 PM' },
  ]

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const getMonthData = (year, month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

    const monthData = []
    for (let i = 0; i < startingDay; i++) {
      monthData.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      monthData.push(i)
    }
    while (monthData.length % 7 !== 0) {
      monthData.push(null)
    }
    return monthData
  }

  const getEventType = (day) => {
    return events.find((e) => e.date === day)?.type
  }

  const getEvent = (day) => {
    return events.find((e) => e.date === day)
  }

  const monthData = getMonthData(currentYear, currentMonth)
  const isMobile = windowWidth < 640

  const EventDetails = ({ event }) => (
    <div className='bg-white rounded-lg shadow-lg p-4 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 z-10'>
      <div
        className={`text-sm font-medium ${
          event.type === 'important'
            ? 'text-red-600'
            : event.type === 'regular'
            ? 'text-green-600'
            : 'text-purple-600'
        }`}
      >
        {event.title}
      </div>
      <div className='text-xs text-gray-500 mt-1'>{event.time}</div>
    </div>
  )

  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden max-w-full'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <CalendarIcon className='text-white' size={20} />
            <h2 className='text-lg font-semibold text-white'>Calendar</h2>
          </div>
          <div className='flex items-center gap-2'>
            <button className='p-1 hover:bg-white/10 rounded-full transition-colors'>
              <ChevronLeft className='text-white' size={20} />
            </button>
            <button className='p-1 hover:bg-white/10 rounded-full transition-colors'>
              <ChevronRight className='text-white' size={20} />
            </button>
          </div>
        </div>
        <div className='text-white/90 text-xl font-medium'>
          {`${months[currentMonth]} ${currentYear}`}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className='p-4'>
        {/* Legend */}
        <div className='flex flex-wrap gap-3 mb-4 justify-end'>
          <div className='flex items-center gap-1.5'>
            <div className='w-2 h-2 rounded-full bg-red-400'></div>
            <span className='text-xs text-gray-600'>Important</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <div className='w-2 h-2 rounded-full bg-green-400'></div>
            <span className='text-xs text-gray-600'>Regular</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <div className='w-2 h-2 rounded-full bg-purple-400'></div>
            <span className='text-xs text-gray-600'>Special</span>
          </div>
        </div>

        {/* Days Grid */}
        <div className='grid grid-cols-7 gap-1 sm:gap-2'>
          {/* Day Names */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className='text-center text-xs font-medium text-gray-500 pb-2'
            >
              {isMobile ? day.charAt(0) : day}
            </div>
          ))}

          {/* Calendar Days */}
          {monthData.map((day, index) => {
            const eventType = day ? getEventType(day) : null
            const event = day ? getEvent(day) : null
            const isSelected = selectedDate === day

            return (
              <div
                key={index}
                className='relative'
                onMouseEnter={() => setSelectedDate(day)}
                onMouseLeave={() => setSelectedDate(null)}
              >
                <div
                  className={`
                    aspect-square flex flex-col items-center justify-center
                    rounded-lg text-sm transition-all duration-200
                    ${
                      !day ? 'text-gray-300' : 'hover:bg-gray-50 cursor-pointer'
                    }
                    ${
                      day === today.getDate()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : ''
                    }
                    ${
                      eventType === 'important'
                        ? 'bg-red-50 hover:bg-red-100'
                        : ''
                    }
                    ${
                      eventType === 'regular'
                        ? 'bg-green-50 hover:bg-green-100'
                        : ''
                    }
                    ${
                      eventType === 'special'
                        ? 'bg-purple-50 hover:bg-purple-100'
                        : ''
                    }
                    ${isSelected ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                  `}
                >
                  <span
                    className={`
                    ${eventType === 'important' ? 'text-red-600' : ''}
                    ${eventType === 'regular' ? 'text-green-600' : ''}
                    ${eventType === 'special' ? 'text-purple-600' : ''}
                    ${day === today.getDate() ? 'text-white' : ''}
                  `}
                  >
                    {day}
                  </span>
                  {eventType && (
                    <div className='flex gap-0.5 mt-1'>
                      <div
                        className={`
                        w-1.5 h-1.5 rounded-full
                        ${eventType === 'important' ? 'bg-red-400' : ''}
                        ${eventType === 'regular' ? 'bg-green-400' : ''}
                        ${eventType === 'special' ? 'bg-purple-400' : ''}
                      `}
                      ></div>
                    </div>
                  )}
                </div>
                {isSelected && event && <EventDetails event={event} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MonthlyCalendar
