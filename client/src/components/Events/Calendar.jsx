import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Download,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { axiosInstance } from '../../config'
import { destinationData } from '../../dataFile'
import EventDetails from './EventDetails'
import { useEventContext } from './EventProvider'

const LoadingSpinner = () => (
  <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
    <div className='relative w-24 h-24'>
      <div className='absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full animate-pulse'></div>
      <div className='absolute top-0 left-0 w-full h-full border-t-8 border-blue-500 rounded-full animate-spin'></div>
      <CalendarIcon
        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500'
        size={32}
      />
    </div>
    <p className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-blue-600'>
      Loading events...
    </p>
  </div>
)

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { draftEvent, checkMaterialAvailability } = useEventContext()

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

  const {
    data: fetchedEventsData = [],
    isLoading,
    error,
  } = useQuery('events', async () => {
    const response = await axiosInstance.get('/events')
    return response.data
  })

  // Extract events from the nested structure
  const fetchedEvents = fetchedEventsData.data?.events || []

  const getEventsForDay = (day, month, year) => {
    const currentDay = new Date(year, month, day)
    const dayEvents = fetchedEvents.filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      const destinationInfo = destinationData[event.destination] || {
        daysToReach: 0,
        daysToReturn: 0,
        cleaningDays: 0,
      }

      const returnStart = new Date(eventEnd)
      returnStart.setDate(returnStart.getDate() + 1)
      const returnEnd = new Date(returnStart)
      returnEnd.setDate(returnEnd.getDate() + destinationInfo.daysToReturn - 1)

      const cleaningDay = new Date(returnEnd)
      cleaningDay.setDate(cleaningDay.getDate() + 1)

      return currentDay >= eventStart && currentDay <= cleaningDay
    })

    let isDraftDay = false
    if (draftEvent && draftEvent.start && draftEvent.end) {
      const draftStart = new Date(draftEvent.start)
      const draftEnd = new Date(draftEvent.end)
      isDraftDay = currentDay >= draftStart && currentDay <= draftEnd
    }

    const isAvailable = checkMaterialAvailability(
      currentDay,
      dayEvents.flatMap((event) => event.details?.selectedMaterials || [])
    )

    return { events: dayEvents, isDraftDay, isAvailable }
  }

  const EventItem = ({ event, currentDate }) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    const destinationInfo = destinationData[event.destination] || {
      daysToReach: 0,
      daysToReturn: 0,
      cleaningDays: 0,
    }

    const returnStart = new Date(eventEnd)
    returnStart.setDate(returnStart.getDate() + 1)
    const returnEnd = new Date(returnStart)
    returnEnd.setDate(returnEnd.getDate() + destinationInfo.daysToReturn - 1)

    const cleaningDay = new Date(returnEnd)
    cleaningDay.setDate(cleaningDay.getDate() + 1)

    let bgColor = 'bg-blue-100' // Default color for event days

    if (currentDate > eventEnd && currentDate <= returnEnd) {
      bgColor = 'bg-orange-100' // Color for return days
    } else if (currentDate.getTime() === cleaningDay.getTime()) {
      bgColor = 'bg-purple-100' // Color for cleaning day
    }
    return (
      <div
        className={`p-1 mb-1 rounded text-xs cursor-pointer hover:bg-opacity-75 transition-colors duration-200 ${bgColor}`}
        onClick={() => !event.isDraft && setSelectedEvent(event)}
      >
        <div className='font-semibold truncate'>
          {event.title || event.eventType}
        </div>
        <div className='text-gray-600 text-xs'>
          {formatTime(event.start)} - {formatTime(event.end)}
        </div>
      </div>
    )
  }

  const generatePDF = async () => {
    const element = document.getElementById('event-details')
    const canvas = await html2canvas(element)
    const data = canvas.toDataURL('image/png')

    const pdf = new jsPDF()
    const imgProperties = pdf.getImageProperties(data)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('event-details.pdf')
  }

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
      const day = daysInPrevMonth - i
      const month = currentDate.getMonth() - 1
      const year = currentDate.getFullYear()
      days.push({ day, month, year, currentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        currentMonth: true,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const month = currentDate.getMonth() + 1
      const year =
        month === 12 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()
      days.push({ day: i, month, year, currentMonth: false })
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
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className='flex flex-col h-full bg-white'>
      <div className='flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 sticky top-0 '>
        <h2 className='text-xl font-semibold text-gray-800 mb-2 sm:mb-0 flex items-center'>
          <CalendarIcon className='mr-2' />
          {months[currentDate.getMonth()]} de {currentDate.getFullYear()}
        </h2>
        <div className='flex items-center space-x-2'>
          <button
            className='px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200'
            onClick={() => setCurrentDate(new Date())}
          >
            Hoy
          </button>
          <button
            onClick={prevMonth}
            className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200'
          >
            <ChevronLeftIcon size={20} className='text-blue-600' />
          </button>
          <button
            onClick={nextMonth}
            className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200'
          >
            <ChevronRightIcon size={20} className='text-blue-600' />
          </button>
        </div>
      </div>

      <div className='grid grid-cols-7 bg-gray-100 border-b border-gray-200 sticky top-16 '>
        {weekdays.map((day) => (
          <div
            key={day}
            className='text-center py-2 text-xs sm:text-sm font-medium text-gray-700'
          >
            {day}
          </div>
        ))}
      </div>

      <div className='flex-grow overflow-y-auto relative'>
        {isLoading && <LoadingSpinner />}
        {error && (
          <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
            <p className='text-red-500 text-lg'>
              Error loading events. Please try again later.
            </p>
          </div>
        )}
        <div className='grid grid-cols-7 auto-rows-fr gap-px bg-gray-200 p-px min-h-full'>
          {calendarDays.map((dayObj, index) => {
            const {
              events: dayEvents,
              isDraftDay,
              isAvailable,
            } = getEventsForDay(dayObj.day, dayObj.month, dayObj.year)

            const currentDate = new Date(dayObj.year, dayObj.month, dayObj.day)

            return (
              <div
                key={index}
                className={`p-1 ${
                  dayObj.currentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                } ${isToday(dayObj.day) ? 'bg-blue-50' : ''} 
                ${isDraftDay ? 'bg-yellow-50' : ''}
                ${!isAvailable ? 'bg-red-100' : ''}
                overflow-hidden flex flex-col min-h-[100px]`}
              >
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    isToday(dayObj.day) ? 'text-blue-600' : ''
                  }`}
                >
                  {dayObj.day}
                </span>
                <div className='flex-grow overflow-y-auto'>
                  {dayEvents.map((event, eventIndex) => (
                    <EventItem
                      key={event.id || `event-${eventIndex}`}
                      event={event}
                      currentDate={currentDate}
                    />
                  ))}
                </div>
                {!isAvailable && (
                  <div className='text-xs text-red-600 mt-1'>Unavailable</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {selectedEvent && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl'>
            <div className='sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b'>
              <h3 className='font-bold text-xl text-gray-800'>
                {selectedEvent.title || selectedEvent.eventType}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={24} />
              </button>
            </div>
            <div className='flex-grow overflow-y-auto p-4'>
              <EventDetails
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
              />
            </div>
            <div className='sticky bottom-0 bg-white z-10 flex justify-end p-4 border-t'>
              <button
                onClick={generatePDF}
                className='flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300'
              >
                <Download size={18} className='mr-2' />
                Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
