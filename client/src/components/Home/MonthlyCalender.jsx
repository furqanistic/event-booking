import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

const RankingSection = () => {
  const [timeFrame, setTimeFrame] = useState('month') // 'month' or 'year'

  const rankings = {
    month: [
      { id: 1, name: 'Sarah Johnson', team: 'Marketing', events: 24 },
      { id: 2, name: 'Mike Chen', team: 'Commercial', events: 22 },
      { id: 3, name: 'Emily Roberts', team: 'Marketing', events: 19 },
      { id: 4, name: 'David Kim', team: 'Commercial', events: 17 },
      { id: 5, name: 'Lisa Garcia', team: 'Marketing', events: 15 },
    ],
    year: [
      { id: 1, name: 'Mike Chen', team: 'Commercial', events: 245 },
      { id: 2, name: 'Sarah Johnson', team: 'Marketing', events: 232 },
      { id: 3, name: 'David Kim', team: 'Commercial', events: 198 },
      { id: 4, name: 'Emily Roberts', team: 'Marketing', events: 187 },
      { id: 5, name: 'Lisa Garcia', team: 'Marketing', events: 176 },
    ],
  }

  const getTrophyColor = (position) => {
    switch (position) {
      case 0:
        return 'text-yellow-400' // Gold
      case 1:
        return 'text-gray-400' // Silver
      case 2:
        return 'text-amber-600' // Bronze
      default:
        return ''
    }
  }

  return (
    <div className='bg-white rounded-xl shadow-lg p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Top Event Creators
        </h3>
        <div className='flex gap-2'>
          <button
            onClick={() => setTimeFrame('month')}
            className={`px-3 py-1 rounded-lg text-sm ${
              timeFrame === 'month'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeFrame('year')}
            className={`px-3 py-1 rounded-lg text-sm ${
              timeFrame === 'year'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            This Year
          </button>
        </div>
      </div>

      <div className='space-y-3'>
        {rankings[timeFrame].map((user, index) => (
          <div
            key={user.id}
            className='flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <div className='w-8 flex justify-center'>
              {index < 3 && (
                <Trophy size={20} className={getTrophyColor(index)} />
              )}
            </div>
            <div className='flex-1 ml-2'>
              <div className='flex justify-between items-center'>
                <div>
                  <span className='font-medium text-gray-900'>{user.name}</span>
                  <span
                    className={`ml-2 text-sm px-2 py-0.5 rounded-full ${
                      user.team === 'Marketing'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.team}
                  </span>
                </div>
                <span className='font-semibold text-gray-900'>
                  {user.events} events
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

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

  // Updated events with marketing and commercial categories
  const events = [
    {
      date: 5,
      type: 'marketing',
      name: 'Product Launch',
      brand: 'Nike',
      time: '10:00 AM',
    },
    {
      date: 12,
      type: 'commercial',
      name: 'Sales Meeting',
      brand: 'Adidas',
      time: '2:00 PM',
    },
    {
      date: 15,
      type: 'marketing',
      name: 'Campaign Review',
      brand: 'Puma',
      time: '9:00 AM',
    },
    {
      date: 23,
      type: 'commercial',
      name: 'Partner Meeting',
      brand: 'Reebok',
      time: '3:30 PM',
    },
  ]

  // Room reservations for today
  const todayReservations = [
    {
      eventName: 'Q4 Marketing Review',
      roomName: 'Conference Room A',
      time: '09:00 AM - 10:30 AM',
    },
    {
      eventName: 'Product Strategy',
      roomName: 'Meeting Room 2B',
      time: '11:00 AM - 12:00 PM',
    },
    {
      eventName: 'Team Sync',
      roomName: 'Collaboration Space',
      time: '02:00 PM - 03:00 PM',
    },
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
      <div className='text-sm font-medium text-gray-900'>{event.name}</div>
      <div className='text-xs text-gray-600 mt-1'>{event.brand}</div>
      <div className='text-xs text-gray-500 mt-1'>{event.time}</div>
    </div>
  )

  return (
    <div className='space-y-6'>
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
              <div className='w-2 h-2 rounded-full bg-purple-400'></div>
              <span className='text-xs text-gray-600'>Marketing Events</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <div className='w-2 h-2 rounded-full bg-blue-400'></div>
              <span className='text-xs text-gray-600'>Commercial Events</span>
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
                  `}
                  >
                    <span
                      className={day === today.getDate() ? 'text-white' : ''}
                    >
                      {day}
                    </span>
                    {eventType && (
                      <div className='flex gap-0.5 mt-1'>
                        <div
                          className={`
                          w-1.5 h-1.5 rounded-full
                          ${eventType === 'marketing' ? 'bg-purple-400' : ''}
                          ${eventType === 'commercial' ? 'bg-blue-400' : ''}
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

      {/* Room Reservations Summary */}
      <div className='bg-white rounded-xl shadow-lg p-4'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Today's Room Reservations
        </h3>
        <div className='space-y-3'>
          {todayReservations.map((reservation, index) => (
            <div
              key={index}
              className='flex flex-col p-3 bg-gray-50 rounded-lg'
            >
              <span className='font-medium text-gray-900'>
                {reservation.eventName}
              </span>
              <span className='text-sm text-gray-600'>
                {reservation.roomName}
              </span>
              <span className='text-sm text-gray-500'>{reservation.time}</span>
            </div>
          ))}
        </div>
      </div>
      <RankingSection />
    </div>
  )
}

export default MonthlyCalendar
