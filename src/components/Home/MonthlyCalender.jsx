import React from 'react'

const MonthlyCalendar = () => {
  const daysOfWeek = ['LUN.', 'MAR.', 'MIÉ.', 'JUE.', 'VIE.', 'SÁB.', 'DOM.']
  const month = 'Septiembre'
  const year = '2024'

  // This is a simplified calendar. In a real application, you'd generate these dynamically.
  const days = [
    null,
    null,
    null,
    null,
    null,
    null,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    null,
    null,
    null,
    null,
    null,
    null,
  ]

  return (
    <div className='bg-white p-4 rounded-lg shadow-md'>
      <h2 className='text-lg font-semibold mb-4'>{`${month}, ${year}`}</h2>
      <div className='grid grid-cols-7 gap-2'>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className='text-center text-xs text-gray-500 font-medium'
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`text-center p-1 ${
              day ? 'hover:bg-gray-100 cursor-pointer' : ''
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
