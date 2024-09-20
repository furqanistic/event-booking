import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ChevronLeftIcon, ChevronRightIcon, Download, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import EventDetails from './EventDetails'
import { useEventContext } from './EventProvider'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { events, draftEvent } = useEventContext()

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

  const getEventsForDay = (day, month, year) => {
    const dayEvents = events.filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      const currentDay = new Date(year, month, day)
      return currentDay >= eventStart && currentDay <= eventEnd
    })

    if (draftEvent && draftEvent.start && draftEvent.end) {
      const draftStart = new Date(draftEvent.start)
      const draftEnd = new Date(draftEvent.end)
      const currentDay = new Date(year, month, day)
      if (currentDay >= draftStart && currentDay <= draftEnd) {
        dayEvents.push({ ...draftEvent, isDraft: true })
      }
    }

    return dayEvents
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

  const EventItem = ({ event, isStart, isEnd }) => (
    <div
      className={`${
        event.isDraft
          ? 'bg-yellow-100 border-yellow-500'
          : 'bg-blue-100 border-blue-500'
      } 
    p-1 mb-1 rounded text-xs cursor-pointer hover:bg-opacity-75 transition-colors duration-200 
    ${isStart ? 'border-l-4' : ''} ${isEnd ? 'border-r-4' : ''}`}
      onClick={() => !event.isDraft && setSelectedEvent(event)}
    >
      <div className='font-semibold truncate'>{event.title}</div>
      <div className='text-yellow-800 text-xs'>
        {formatTime(event.start)} - {formatTime(event.end)}
      </div>
    </div>
  )

  return (
    <div className='flex flex-col h-full bg-white'>
      <div className='flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2 sm:mb-0'>
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

      <div className='grid grid-cols-7 bg-gray-100 border-b border-gray-200'>
        {weekdays.map((day) => (
          <div
            key={day}
            className='text-center py-2 text-xs sm:text-sm font-medium text-gray-700'
          >
            {day}
          </div>
        ))}
      </div>
      <div className='flex-grow grid grid-cols-7 grid-rows-6 gap-px bg-gray-200'>
        {calendarDays.map((dayObj, index) => {
          const dayEvents = getEventsForDay(
            dayObj.day,
            dayObj.month,
            dayObj.year
          )
          return (
            <div
              key={index}
              className={`bg-white p-1 ${
                dayObj.currentMonth
                  ? 'text-gray-700'
                  : 'text-gray-400 bg-gray-50'
              } ${
                isToday(dayObj.day) ? 'bg-blue-50' : ''
              } overflow-hidden flex flex-col`}
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
                    key={event.id || `draft-${eventIndex}`}
                    event={event}
                    isStart={
                      new Date(event.start).toDateString() ===
                      new Date(
                        dayObj.year,
                        dayObj.month,
                        dayObj.day
                      ).toDateString()
                    }
                    isEnd={
                      new Date(event.end).toDateString() ===
                      new Date(
                        dayObj.year,
                        dayObj.month,
                        dayObj.day
                      ).toDateString()
                    }
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {selectedEvent && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl'>
            <div className='sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b'>
              <h3 className='font-bold text-xl text-gray-800'>
                {selectedEvent.title}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={24} />
              </button>
            </div>
            <EventDetails event={selectedEvent} />
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
