import React from 'react'

const MonthlyCalendar = () => {
  const daysOfWeek = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const getMonthData = (year, month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // Adjust for Monday start

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

  const monthData = getMonthData(currentYear, currentMonth)

  return (
    <div className='bg-white p-4 rounded-lg shadow-md'>
      <h2 className='text-lg font-semibold mb-4'>{`${months[currentMonth]}, ${currentYear}`}</h2>
      <div className='grid grid-cols-7 gap-2'>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className='text-center text-xs text-gray-500 font-medium'
          >
            {day}
          </div>
        ))}
        {monthData.map((day, index) => (
          <div
            key={index}
            className={`text-center p-1 ${
              day ? 'hover:bg-gray-100 cursor-pointer' : ''
            } ${
              day === today.getDate()
                ? 'bg-blue-100 text-blue-600 font-bold rounded-full'
                : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MonthlyCalendar
