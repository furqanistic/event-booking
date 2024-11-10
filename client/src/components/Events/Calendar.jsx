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
  } = useQuery(
    'events',
    async () => {
      const response = await axiosInstance.get('/events')
      return response.data
    },
    {
      refetchInterval: 2000, // Refetch every 5 seconds
    }
  )

  const ColorLegend = () => (
    <div className='flex flex-wrap items-center justify-center gap-4 p-2 bg-gray-100 text-xs'>
      <div className='flex items-center'>
        <div className='w-4 h-4 bg-blue-100 mr-2'></div>
        <span>In-Transit</span>
      </div>
      <div className='flex items-center'>
        <div className='w-4 h-4 bg-yellow-100 mr-2'></div>
        <span>Event</span>
      </div>
      <div className='flex items-center'>
        <div className='w-4 h-4 bg-purple-100 mr-2'></div>
        <span>Cleaning</span>
      </div>
      <div className='flex items-center'>
        <div className='w-4 h-4 bg-red-400 mr-2'></div>
        <span>Extended</span>
      </div>
    </div>
  )

  // Extract events from the nested structure
  const fetchedEvents = fetchedEventsData.data?.events || []

  const getEventsForDay = (day, month, year) => {
    const currentDay = new Date(year, month, day)
    const dayEvents = fetchedEvents
      .filter((event) => {
        const eventStart = new Date(event.start)
        const eventEnd = new Date(event.end)
        const destinationInfo = destinationData[event.destination] || {
          daysToReach: 0,
          daysToReturn: 0,
          cleaningDays: 0,
        }

        const reachStart = new Date(eventStart)
        reachStart.setDate(reachStart.getDate() - destinationInfo.daysToReach)

        const returnStart = new Date(eventEnd)
        returnStart.setDate(returnStart.getDate() + 1)
        const returnEnd = new Date(returnStart)
        returnEnd.setDate(
          returnEnd.getDate() + destinationInfo.daysToReturn - 1
        )

        const cleaningDay = new Date(returnEnd)
        cleaningDay.setDate(cleaningDay.getDate() + 1)

        // Calculate extended end date if extendDate exists
        let extendedEndDate = null
        if (event.extendDate) {
          extendedEndDate = new Date(cleaningDay)
          extendedEndDate.setDate(extendedEndDate.getDate() + event.extendDate)
        }

        return (
          currentDay >= reachStart &&
          (extendedEndDate
            ? currentDay <= extendedEndDate
            : currentDay <= cleaningDay)
        )
      })
      .map((event) => {
        const eventStart = new Date(event.start)
        const eventEnd = new Date(event.end)
        const destinationInfo = destinationData[event.destination] || {
          daysToReach: 0,
          daysToReturn: 0,
          cleaningDays: 0,
        }

        const reachStart = new Date(eventStart)
        reachStart.setDate(reachStart.getDate() - destinationInfo.daysToReach)

        const returnStart = new Date(eventEnd)
        returnStart.setDate(returnStart.getDate() + 1)
        const returnEnd = new Date(returnStart)
        returnEnd.setDate(
          returnEnd.getDate() + destinationInfo.daysToReturn - 1
        )

        const cleaningDay = new Date(returnEnd)
        cleaningDay.setDate(cleaningDay.getDate() + 1)

        // Calculate extended period
        let extendedStartDate = null
        let extendedEndDate = null
        if (event.extendDate) {
          extendedStartDate = new Date(cleaningDay)
          extendedStartDate.setDate(extendedStartDate.getDate() + 1)
          extendedEndDate = new Date(extendedStartDate)
          extendedEndDate.setDate(
            extendedEndDate.getDate() + event.extendDate - 1
          )
        }

        return {
          ...event,
          isReach: currentDay >= reachStart && currentDay < eventStart,
          isEventDay: currentDay >= eventStart && currentDay <= eventEnd,
          isReturn: currentDay > eventEnd && currentDay <= returnEnd,
          isCleaning: currentDay.toDateString() === cleaningDay.toDateString(),
          isExtended:
            extendedStartDate &&
            currentDay >= extendedStartDate &&
            currentDay <= extendedEndDate,
          isStart: eventStart.toDateString() === currentDay.toDateString(),
          isEnd: eventEnd.toDateString() === currentDay.toDateString(),
          isExtendedStart:
            extendedStartDate &&
            extendedStartDate.toDateString() === currentDay.toDateString(),
          isExtendedEnd:
            extendedEndDate &&
            extendedEndDate.toDateString() === currentDay.toDateString(),
        }
      })

    // Sort events by start date and assign positions
    dayEvents.sort((a, b) => new Date(a.start) - new Date(b.start))
    dayEvents.forEach((event, index) => {
      event.position = index
    })

    return {
      events: dayEvents,
      isDraftDay:
        draftEvent?.start && draftEvent?.end
          ? currentDay >= new Date(draftEvent.start) &&
            currentDay <= new Date(draftEvent.end)
          : false,
      isAvailable: checkMaterialAvailability(
        currentDay,
        dayEvents.flatMap((event) => event.details?.selectedMaterials || [])
      ),
    }
  }

  const EventItem = ({ event, position }) => {
    let bgColor = ''
    let label = ''

    if (event.isReach || event.isReturn) {
      bgColor = 'bg-blue-100'
      label = 'In-Transit'
    } else if (event.isCleaning) {
      bgColor = 'bg-purple-100'
      label = 'Cleaning'
    } else if (event.isExtended) {
      bgColor = 'bg-red-400'
      label = 'Extended'
    } else {
      bgColor = 'bg-yellow-100'
      label = event.title || event.eventType
    }

    const borderLeft =
      event.isStart || event.isReach || event.isExtendedStart
        ? 'border-l-2'
        : ''
    const borderRight =
      event.isEnd || event.isCleaning || event.isExtendedEnd ? 'border-r-2' : ''
    const borderColor = event.isExtended ? 'border-red-400' : 'border-gray-400'
    const borders = `border-t border-b ${borderLeft} ${borderRight} ${borderColor}`
    const opacity =
      event.isReach || event.isReturn
        ? 'opacity-70'
        : event.isCleaning
        ? 'opacity-80'
        : event.isExtended
        ? 'opacity-75'
        : ''

    return (
      <div
        className={`h-6 ${bgColor} ${borders} ${opacity}
        cursor-pointer hover:bg-opacity-75 transition-colors duration-200
        text-xs overflow-hidden flex items-center
        absolute left-0 right-0 group`}
        style={{
          width: 'calc(100% + 2px)',
          marginLeft: '-1px',
          marginRight: '-1px',
          top: `${position * 34 + 2}px`,
        }}
        onClick={() => !event.isDraft && setSelectedEvent(event)}
      >
        <div className='pl-2 flex flex-col overflow-hidden flex-grow relative'>
          <span className='font-semibold whitespace-nowrap overflow-hidden text-ellipsis'>
            {label}
          </span>
          {/* Updated Tooltip */}
          <div className='absolute hidden group-hover:block bg-white p-2 rounded shadow-lg z-50 left-0 top-7 w-48 text-xs'>
            <p className='font-bold'>{event.title || event.eventType}</p>
            <p>Start: {new Date(event.start).toLocaleDateString()}</p>
            <p>End: {new Date(event.end).toLocaleDateString()}</p>
            {event.extendDate && (
              <p className='text-green-600'>
                Extended: {event.extendDate} days
              </p>
            )}
            <p>Destination: {event.destination}</p>
          </div>
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
      <div className='flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 bg-gray-50 sticky top-0 z-20'>
        <h2 className='text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0 flex items-center'>
          <CalendarIcon className='mr-2' size={20} />
          {months[currentDate.getMonth()]} de {currentDate.getFullYear()}
        </h2>
        <div className='flex items-center space-x-2'>
          <button
            className='px-2 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200'
            onClick={() => setCurrentDate(new Date())}
          >
            Hoy
          </button>
          <button
            onClick={prevMonth}
            className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200'
          >
            <ChevronLeftIcon size={18} className='text-blue-600' />
          </button>
          <button
            onClick={nextMonth}
            className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200'
          >
            <ChevronRightIcon size={18} className='text-blue-600' />
          </button>
        </div>
      </div>
      <ColorLegend />
      <div className='grid grid-cols-7 bg-gray-100 border-b border-gray-200 sticky top-16 z-10'>
        {weekdays.map((day) => (
          <div
            key={day}
            className='text-center py-1 sm:py-2 text-xs font-medium text-gray-700'
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
        <div className='grid grid-cols-7 bg-gray-200 min-h-full'>
          {calendarDays.map((dayObj, index) => {
            const {
              events: dayEvents,
              isDraftDay,
              isAvailable,
            } = getEventsForDay(dayObj.day, dayObj.month, dayObj.year)

            return (
              <div
                key={index}
                className={`${
                  dayObj.currentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                } ${isToday(dayObj.day) ? 'bg-blue-50' : ''} 
        ${isDraftDay ? 'bg-yellow-50' : ''}
        ${!isAvailable ? 'bg-red-100' : ''}
        overflow-hidden flex flex-col min-h-[120px] sm:min-h-[140px] relative border-r border-b border-gray-200`}
              >
                <span
                  className={`text-xs sm:text-sm font-semibold p-1 ${
                    isToday(dayObj.day) ? 'text-blue-600' : ''
                  }`}
                >
                  {dayObj.day}
                </span>
                <div className='flex-grow flex flex-col gap-1 relative'>
                  {dayEvents.map((event, eventIndex) => (
                    <EventItem
                      key={event.id || `event-${eventIndex}`}
                      event={event}
                      isStart={event.isStart}
                      isEnd={event.isEnd}
                      isMiddle={event.isMiddle}
                      isReach={event.isReach}
                      position={eventIndex}
                    />
                  ))}
                </div>
                {!isAvailable && (
                  <div className='text-xs text-red-600 p-1'>Unavailable</div>
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
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg w-full max-w-2xl h-[90vh] flex flex-col'>
                <EventDetails
                  event={selectedEvent}
                  onClose={() => setSelectedEvent(null)}
                />
              </div>
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
