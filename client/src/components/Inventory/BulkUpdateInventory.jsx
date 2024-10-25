import { Calendar, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react'
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
        const newQuantities = {}
        for (let day = 1; day <= 31; day++) {
          const dayData = monthData?.days.find((d) => d.day === day)
          newQuantities[day] = dayData ? dayData.quantity : null
        }
        setQuantities(newQuantities)
      },
    }
  )

  const handleMonthChange = (increment) => {
    let newMonth = selectedMonth + increment
    let newYear = selectedYear

    if (newMonth > 12) {
      newMonth = 1
      newYear += 1
    } else if (newMonth < 1) {
      newMonth = 12
      newYear -= 1
    }

    setSelectedMonth(newMonth)
    setSelectedYear(newYear)
  }

  const handleQuantityChange = (day, value) => {
    const newValue = value === '' ? null : parseInt(value)
    setQuantities((prev) => ({
      ...prev,
      [day]: newValue === data.MaxQuantity ? null : newValue,
    }))
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
    const days = Object.entries(quantities)
      .filter(([_, quantity]) => quantity !== null)
      .map(([day, quantity]) => ({
        day: parseInt(day),
        quantity,
      }))

    updateMutation.mutate({
      year: selectedYear,
      month: selectedMonth,
      days,
    })
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
      calendarDays.push(<div key={`empty-${i}`} className='h-24' />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled =
        new Date(selectedYear, selectedMonth - 1, day) < currentDate
      const quantity = quantities[day]
      const displayValue = quantity === null ? data.MaxQuantity : quantity
      const isToday =
        new Date(selectedYear, selectedMonth - 1, day).toDateString() ===
        new Date().toDateString()

      calendarDays.push(
        <div
          key={day}
          className={`relative border border-gray-100 p-3 h-24 transition-colors ${
            isToday ? 'bg-blue-50' : ''
          } ${isDisabled ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
        >
          <div
            className={`absolute top-2 left-2 ${
              isToday ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
          <div className='pt-6'>
            <input
              type='number'
              value={displayValue}
              onChange={(e) => handleQuantityChange(day, e.target.value)}
              className={`w-full p-2 border rounded-lg transition-colors
                ${isDisabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
                ${quantity === null ? 'text-gray-400' : 'text-gray-900'}
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              disabled={isDisabled}
              min='0'
            />
          </div>
        </div>
      )
    }

    return calendarDays
  }

  if (error) {
    return (
      <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <p className='text-red-500'>Error loading data</p>
          <button
            onClick={onClose}
            className='mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300'
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto'>
      <div className='min-h-screen px-4 py-8'>
        <div className='bg-white rounded-xl shadow-xl max-w-5xl mx-auto'>
          {/* Header */}
          <div className='border-b px-6 py-4 flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Update Inventory
              </h2>
              <p className='text-sm text-gray-500 mt-1'>{itemName}</p>
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-gray-100 rounded-full transition-colors'
            >
              <X className='w-5 h-5 text-gray-500' />
            </button>
          </div>

          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <Loader2 className='w-8 h-8 text-blue-500 animate-spin' />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <div className='flex items-center space-x-4'>
                    <Calendar className='w-5 h-5 text-gray-400' />
                    <div className='flex items-center'>
                      <button
                        type='button'
                        onClick={() => handleMonthChange(-1)}
                        className='p-1 hover:bg-gray-100 rounded-full'
                      >
                        <ChevronLeft className='w-5 h-5 text-gray-500' />
                      </button>
                      <span className='mx-2 text-lg font-medium'>
                        {months[selectedMonth - 1]} {selectedYear}
                      </span>
                      <button
                        type='button'
                        onClick={() => handleMonthChange(1)}
                        className='p-1 hover:bg-gray-100 rounded-full'
                      >
                        <ChevronRight className='w-5 h-5 text-gray-500' />
                      </button>
                    </div>
                  </div>
                  <div className='bg-blue-50 px-4 py-2 rounded-lg'>
                    <span className='text-sm text-blue-700'>
                      Default Quantity:{' '}
                      <span className='font-medium'>{data?.MaxQuantity}</span>
                    </span>
                  </div>
                </div>

                <div className='grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden'>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day) => (
                      <div
                        key={day}
                        className='bg-gray-50 text-gray-500 text-sm font-medium p-3 text-center'
                      >
                        {day}
                      </div>
                    )
                  )}
                  {renderCalendar()}
                </div>
              </div>

              <div className='border-t px-6 py-4 flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={onClose}
                  className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={updateMutation.isLoading}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2'
                >
                  {updateMutation.isLoading && (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  )}
                  <span>Update Inventory</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default BulkUpdateInventory
