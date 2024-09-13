import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState([])

  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]

  const weekdays = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

  useEffect(() => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate()
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay()
    const daysInPrevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate()

    let days = []

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, currentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true })
    }

    // Next month days
    const remainingDays = 42 - days.length // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, currentMonth: false })
    }

    setCalendarDays(days)
  }, [currentDate])

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className='flex flex-col h-full bg-white'>
      <div className='flex items-center justify-between p-4 bg-gray-50'>
        <h2 className='text-xl font-semibold text-gray-800'>
          {months[currentDate.getMonth()]} de {currentDate.getFullYear()}
        </h2>
        <div className='flex items-center space-x-2'>
          <button className='px-3 py-1 text-sm bg-gray-200 rounded-md'>
            hoy
          </button>
          <button
            onClick={prevMonth}
            className='p-1 rounded-full hover:bg-gray-200'
          >
            <ChevronLeftIcon size={20} className='text-blue-600' />
          </button>
          <button
            onClick={nextMonth}
            className='p-1 rounded-full hover:bg-gray-200'
          >
            <ChevronRightIcon size={20} className='text-blue-600' />
          </button>
        </div>
      </div>
      <div className='grid grid-cols-7 bg-gray-50 border-b border-gray-200'>
        {weekdays.map((day) => (
          <div
            key={day}
            className='text-center py-2 text-xs font-medium text-blue-600'
          >
            {day}
          </div>
        ))}
      </div>
      <div className='flex-grow grid grid-cols-7 grid-rows-6 gap-px bg-gray-200'>
        {calendarDays.map((dayObj, index) => (
          <div
            key={index}
            className={`bg-white p-1 ${
              dayObj.currentMonth ? 'text-gray-700' : 'text-gray-400'
            } ${isToday(dayObj.day) ? 'bg-blue-100' : ''}`}
          >
            <span className='text-xs'>{dayObj.day}</span>
            {/* Event placeholders can be added here */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar
