import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { axiosInstance } from '../../config'

const BulkUpdateInventory = ({
  itemId,
  itemName,
  onClose,
  showNotification,
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [quantities, setQuantities] = useState({})
  const queryClient = useQueryClient()

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

  const { data, isLoading, error } = useQuery(
    ['material', itemId, selectedYear, selectedMonth],
    async () => {
      const response = await axiosInstance.get(`/materials/${itemId}`)
      return response.data.data.material
    },
    {
      onSuccess: (data) => {
        const monthData = data.availability.find(
          (item) => item.year === selectedYear && item.month === selectedMonth
        )
        if (monthData) {
          const newQuantities = {}
          monthData.days.forEach(({ day, quantity }) => {
            newQuantities[day] = quantity
          })
          setQuantities(newQuantities)
        } else {
          setQuantities({})
        }
      },
    }
  )

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value))
  }

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value))
  }

  const handleQuantityChange = (day, value) => {
    setQuantities((prev) => ({ ...prev, [day]: parseInt(value) || 0 }))
  }

  const updateMutation = useMutation(
    (updatedData) =>
      axiosInstance.patch(`/materials/${itemId}/bulk-update`, updatedData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['material', itemId])
        showNotification('Inventory updated successfully')
        onClose()
      },
      onError: (error) => {
        console.error('Update error:', error)
        showNotification('Failed to update inventory', 'error')
      },
    }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    const days = Object.entries(quantities).map(([day, quantity]) => ({
      day: parseInt(day),
      quantity,
    }))
    const updatedAvailability = {
      year: selectedYear,
      month: selectedMonth,
      days,
    }

    updateMutation.mutate(updatedAvailability)
  }

  const renderCalendar = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
    const firstDayOfMonth = new Date(
      selectedYear,
      selectedMonth - 1,
      1
    ).getDay()
    const currentDate = new Date()

    const calendarDays = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className='h-24'></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled =
        new Date(selectedYear, selectedMonth - 1, day) < currentDate
      calendarDays.push(
        <div key={day} className='border p-2 h-24'>
          <div className='font-bold'>{day}</div>
          <input
            type='number'
            value={quantities[day] || 0}
            onChange={(e) => handleQuantityChange(day, e.target.value)}
            className={`w-full p-1 mt-1 border rounded ${
              isDisabled ? 'bg-gray-200' : ''
            }`}
            min='0'
            disabled={isDisabled}
          />
        </div>
      )
    }

    return (
      <div className='grid grid-cols-7 gap-1 mt-4'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className='font-bold text-center'>
            {day}
          </div>
        ))}
        {calendarDays}
      </div>
    )
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10'>
      <div className='bg-white rounded-lg p-8 m-4 max-w-4xl w-full'>
        <h2 className='text-2xl font-bold mb-4'>
          Update Inventory for {itemName}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center'>
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className='p-2 border border-gray-300 rounded-md mr-2'
              >
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className='p-2 border border-gray-300 rounded-md'
              >
                {[...Array(10)].map((_, i) => {
                  const year = new Date().getFullYear() + i
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {renderCalendar()}

          <div className='mt-6 flex justify-end space-x-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BulkUpdateInventory
