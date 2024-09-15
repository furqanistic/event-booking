import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ChevronLeftIcon, ChevronRightIcon, Download, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useEventContext } from './EventProvider'
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { events } = useEventContext()
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

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      )
    })
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
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return (
    <div className='flex flex-col h-full bg-white'>
      <div className='flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2 sm:mb-0'>
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
            className='text-center py-2 text-xs sm:text-sm font-medium text-blue-600'
          >
            {day}
          </div>
        ))}
      </div>
      <div className='flex-grow grid grid-cols-7 grid-rows-6 gap-px bg-gray-200'>
        {calendarDays.map((dayObj, index) => (
          <div
            key={index}
            className={`bg-white p-1 sm:p-2 ${
              dayObj.currentMonth ? 'text-gray-700' : 'text-gray-400'
            } ${isToday(dayObj.day) ? 'bg-blue-100' : ''}`}
          >
            <span className='text-xs sm:text-sm'>{dayObj.day}</span>
            {getEventsForDay(dayObj.day).map((event) => (
              <div
                key={event.id}
                className='bg-blue-500 text-white text-xs p-1 mt-1 rounded cursor-pointer'
                onClick={() => setSelectedEvent(event)}
              >
                <div>{event.title}</div>
                <div>
                  {formatTime(event.start)} - {formatTime(event.end)}
                </div>
              </div>
            ))}
          </div>
        ))}
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
            <div id='event-details' className='p-6 space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Start</p>
                  <p className='mt-1'>
                    {new Date(selectedEvent.start).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-500'>End</p>
                  <p className='mt-1'>
                    {new Date(selectedEvent.end).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Event Type</p>
                <p className='mt-1'>{selectedEvent.details.eventType}</p>
              </div>
              {selectedEvent.details.materials &&
                selectedEvent.details.selectedMaterials.length > 0 && (
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Materials
                    </p>
                    <ul className='list-disc pl-5 mt-1'>
                      {selectedEvent.details.selectedMaterials.map(
                        (material, index) => (
                          <li key={index}>{material}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              {selectedEvent.details.sala && (
                <div className='space-y-2'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Room</p>
                    <p className='mt-1'>{selectedEvent.details.selectedRoom}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Capacity
                    </p>
                    <p className='mt-1'>
                      {selectedEvent.details.roomCapacity}{' '}
                      {selectedEvent.details.roomCapacity === '1'
                        ? 'person'
                        : 'people'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Assistants
                    </p>
                    <p className='mt-1'>{selectedEvent.details.assistants}</p>
                  </div>
                </div>
              )}
              {selectedEvent.details.merchandising &&
                selectedEvent.details.selectedMerchandising.length > 0 && (
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Merchandising
                    </p>
                    <ul className='list-disc pl-5 mt-1'>
                      {selectedEvent.details.selectedMerchandising.map(
                        (item, index) => (
                          <li key={index}>{item}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              <div>
                <p className='text-sm font-medium text-gray-500'>Address</p>
                <p className='mt-1'>{selectedEvent.details.address}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Reference</p>
                <p className='mt-1'>{selectedEvent.details.reference}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Location</p>
                <p className='mt-1'>
                  {selectedEvent.details.department},{' '}
                  {selectedEvent.details.province},{' '}
                  {selectedEvent.details.district}
                </p>
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
