import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

const RoomCalendar = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
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

  // Sample room reservation data
  const reservations = [
    {
      date: 5,
      type: 'training',
      title: 'Product Training',
      room: 'Training Room A',
      time: '10:00 AM - 12:00 PM',
      attendees: 15,
    },
    {
      date: 12,
      type: 'meeting',
      title: 'Sales Strategy Meeting',
      room: 'Conference Room B',
      time: '2:00 PM - 4:00 PM',
      attendees: 8,
    },
    {
      date: 15,
      type: 'workshop',
      title: 'Technical Workshop',
      room: 'Workshop Room',
      time: '9:00 AM - 5:00 PM',
      attendees: 20,
    },
    {
      date: 23,
      type: 'presentation',
      title: 'Client Presentation',
      room: 'Meeting Room C',
      time: '3:30 PM - 5:00 PM',
      attendees: 12,
    },
  ]

  // Today's room reservations
  const todayReservations = [
    {
      title: 'Technical Training Session',
      room: 'Training Room A',
      time: '09:00 AM - 12:30 PM',
      type: 'training',
      attendees: 15,
    },
    {
      title: 'Product Demo',
      room: 'Meeting Room 2B',
      time: '02:00 PM - 03:30 PM',
      type: 'presentation',
      attendees: 8,
    },
    {
      title: 'Team Workshop',
      room: 'Workshop Space',
      time: '04:00 PM - 05:30 PM',
      type: 'workshop',
      attendees: 12,
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

  const getReservationType = (day) => {
    return reservations.find((r) => r.date === day)?.type
  }

  const getReservation = (day) => {
    return reservations.find((r) => r.date === day)
  }

  const monthData = getMonthData(currentYear, currentMonth)
  const isMobile = windowWidth < 640

  const getTypeColor = (type) => {
    switch (type) {
      case 'training':
        return 'bg-purple-100 text-purple-800'
      case 'meeting':
        return 'bg-blue-100 text-blue-800'
      case 'workshop':
        return 'bg-green-100 text-green-800'
      case 'presentation':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDotColor = (type) => {
    switch (type) {
      case 'training':
        return 'bg-purple-400'
      case 'meeting':
        return 'bg-blue-400'
      case 'workshop':
        return 'bg-green-400'
      case 'presentation':
        return 'bg-amber-400'
      default:
        return 'bg-gray-400'
    }
  }

  const ReservationCard = ({ reservation }) => (
    <div className='p-3'>
      <div className='text-sm font-medium text-gray-900'>
        {reservation.title}
      </div>
      <div className='text-xs text-gray-600 mt-1'>{reservation.room}</div>
      <div className='text-xs text-gray-500 mt-1'>{reservation.time}</div>
      <div className='flex items-center gap-1 mt-2'>
        <Users size={14} className='text-gray-500' />
        <span className='text-xs text-gray-600'>
          {reservation.attendees} attendees
        </span>
      </div>
      <Badge className={`mt-2 ${getTypeColor(reservation.type)}`}>
        {reservation.type.charAt(0).toUpperCase() + reservation.type.slice(1)}
      </Badge>
    </div>
  )

  return (
    <div className='space-y-6'>
      <Card className='bg-white rounded-xl shadow-lg overflow-hidden'>
        {/* Header */}
        <div className='bg-blue-600 p-4'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <CalendarIcon className='text-white' size={20} />
              <h2 className='text-lg font-semibold text-white'>
                Room Reservations
              </h2>
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

        <CardContent className='p-4'>
          {/* Legend */}
          <div className='flex flex-wrap gap-3 mb-4 justify-end'>
            <div className='flex items-center gap-1.5'>
              <div className='w-2 h-2 rounded-full bg-purple-400'></div>
              <span className='text-xs text-gray-600'>Training</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <div className='w-2 h-2 rounded-full bg-blue-400'></div>
              <span className='text-xs text-gray-600'>Meeting</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <div className='w-2 h-2 rounded-full bg-green-400'></div>
              <span className='text-xs text-gray-600'>Workshop</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <div className='w-2 h-2 rounded-full bg-amber-400'></div>
              <span className='text-xs text-gray-600'>Presentation</span>
            </div>
          </div>

          {/* Calendar Grid */}
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
              const reservation = day ? getReservation(day) : null
              const reservationType = day ? getReservationType(day) : null

              return (
                <div key={index} className='aspect-square'>
                  {day && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={`
                            w-full h-full flex flex-col items-center justify-center
                            rounded-lg text-sm transition-colors duration-200
                            ${
                              day === today.getDate()
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'hover:bg-gray-50'
                            }
                          `}
                        >
                          <span>{day}</span>
                          {reservationType && (
                            <div className='flex gap-0.5 mt-1'>
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${getDotColor(
                                  reservationType
                                )}`}
                              ></div>
                            </div>
                          )}
                        </button>
                      </PopoverTrigger>
                      {reservation && (
                        <PopoverContent className='w-64 p-0'>
                          <ReservationCard reservation={reservation} />
                        </PopoverContent>
                      )}
                    </Popover>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Room Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {todayReservations.map((reservation, index) => (
              <div
                key={index}
                className='flex flex-col p-3 bg-gray-50 rounded-lg'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <span className='font-medium text-gray-900'>
                      {reservation.title}
                    </span>
                    <Badge className={`ml-2 ${getTypeColor(reservation.type)}`}>
                      {reservation.type.charAt(0).toUpperCase() +
                        reservation.type.slice(1)}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Users size={14} className='text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      {reservation.attendees}
                    </span>
                  </div>
                </div>
                <span className='text-sm text-gray-600 mt-1'>
                  {reservation.room}
                </span>
                <span className='text-sm text-gray-500'>
                  {reservation.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoomCalendar
