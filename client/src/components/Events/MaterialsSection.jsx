import {
  AlertCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  RefreshCwIcon,
  Trash2Icon,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useMutation, useQuery } from 'react-query'
import { axiosInstance } from '../../config'

const Loader = () => (
  <div className='flex justify-center items-center h-40'>
    <div className='relative w-20 h-20'>
      <div className='absolute top-0 left-0 right-0 bottom-0 bg-blue-500 rounded-full opacity-25 animate-ping'></div>
      <div className='absolute top-2 left-2 right-2 bottom-2 bg-blue-500 rounded-full opacity-75 animate-pulse'></div>
      <div className='absolute top-3 left-3 right-3 bottom-3 bg-white rounded-full flex items-center justify-center'>
        <svg
          className='w-8 h-8 text-blue-500'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 14l-7 7m0 0l-7-7m7 7V3'
          />
        </svg>
      </div>
    </div>
  </div>
)

const MaterialsSection = ({ formData, setFormData }) => {
  const [materialsTab, setMaterialsTab] = useState('find')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [availabilityChecked, setAvailabilityChecked] = useState(false)
  const itemsPerPage = 5

  const {
    data: materialsData,
    isLoading,
    error,
  } = useQuery('materials', async () => {
    const response = await axiosInstance.get('/materials')
    return response.data.data.items
  })

  console.log(materialsData)

  const checkAvailabilityMutation = useMutation(
    async (data) => {
      const response = await axiosInstance.post(
        '/materials/check-availability',
        data
      )
      return response.data
    },
    {
      onSuccess: (data) => {
        setFormData((prevState) => ({
          ...prevState,
          selectedMaterials: prevState.selectedMaterials.map((item) => {
            const availabilityCheck = data.items.find(
              (check) => check.id === item._id
            )
            return {
              ...item,
              availableQuantity: availabilityCheck
                ? availabilityCheck.availableQuantity
                : 0,
              quantity: Math.min(
                item.quantity,
                availabilityCheck ? availabilityCheck.availableQuantity : 0
              ),
            }
          }),
        }))
        setAvailabilityChecked(true)
      },
    }
  )

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setAvailabilityChecked(false)
  }

  const handleUpdateAvailability = (e) => {
    e.preventDefault()
    if (formData.selectedMaterials.length > 0 && selectedDate) {
      checkAvailabilityMutation.mutate({
        items: formData.selectedMaterials.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
        })),
        date: selectedDate.toISOString(),
      })
    }
  }

  const handleItemToggle = (itemId) => {
    setFormData((prevState) => {
      const item = materialsData.find((i) => i._id === itemId)
      const updatedItems = prevState.selectedMaterials.some(
        (i) => i._id === itemId
      )
        ? prevState.selectedMaterials.filter((i) => i._id !== itemId)
        : [
            ...prevState.selectedMaterials,
            { ...item, quantity: 1, availableQuantity: 0 },
          ]
      return { ...prevState, selectedMaterials: updatedItems }
    })
  }

  const handleQuantityChange = (e, itemId, change) => {
    e.preventDefault() // Prevent form submission
    setFormData((prevState) => {
      const updatedItems = prevState.selectedMaterials.map((item) => {
        if (item._id === itemId) {
          const newQuantity = Math.max(
            1,
            Math.min(item.quantity + change, item.availableQuantity)
          )
          return { ...item, quantity: newQuantity }
        }
        return item
      })
      return { ...prevState, selectedMaterials: updatedItems }
    })
  }

  const handleRemoveItem = (e, itemId) => {
    e.preventDefault() // Prevent form submission
    setFormData((prevState) => ({
      ...prevState,
      selectedMaterials: prevState.selectedMaterials.filter(
        (item) => item._id !== itemId
      ),
    }))
  }

  const filteredItems = materialsData
    ? materialsData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const MaterialsList = () => {
    if (isLoading) return <Loader />
    if (error)
      return (
        <p className='text-red-500 text-center py-4'>
          Error loading materials. Please try again later.
        </p>
      )

    return (
      <div className='space-y-2'>
        {currentItems.map((item) => (
          <div
            key={item._id}
            className='flex items-center justify-between p-2 border border-gray-200 rounded-md'
          >
            <div className='flex items-center space-x-2'>
              <img
                src={item.imagePath}
                alt={item.name}
                className='w-12 h-12 object-cover rounded'
              />
              <div>
                <p className='font-medium'>{item.name}</p>
              </div>
            </div>
            <button
              type='button'
              onClick={() => handleItemToggle(item._id)}
              className={`w-8 h-8 flex items-center justify-center ${
                formData.selectedMaterials.some((i) => i._id === item._id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              } rounded-md`}
            >
              {formData.selectedMaterials.some((i) => i._id === item._id)
                ? '-'
                : '+'}
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-4 border border-gray-200 rounded-md p-4'>
      <h3 className='font-medium text-gray-700'>Materials</h3>
      <div className='flex border-b'>
        <button
          className={`flex-1 py-2 ${
            materialsTab === 'find' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={(e) => {
            e.preventDefault()
            setMaterialsTab('find')
          }}
        >
          Find
        </button>
        <button
          className={`flex-1 py-2 ${
            materialsTab === 'request' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={(e) => {
            e.preventDefault()
            setMaterialsTab('request')
          }}
        >
          Your request
        </button>
      </div>
      {materialsTab === 'find' && (
        <>
          <div className='relative'>
            <input
              type='text'
              placeholder='What do you want to look for?'
              className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <MaterialsList />
          <div className='flex justify-between items-center mt-4'>
            <button
              type='button'
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className='p-2 bg-gray-200 rounded-full disabled:opacity-50'
            >
              <ChevronLeftIcon size={20} />
            </button>
            <span>
              {currentPage} / {Math.ceil(filteredItems.length / itemsPerPage)}
            </span>
            <button
              type='button'
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastItem >= filteredItems.length}
              className='p-2 bg-gray-200 rounded-full disabled:opacity-50'
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>
        </>
      )}
      {materialsTab === 'request' && (
        <div className='bg-white rounded-md shadow-sm'>
          <h4 className='font-medium p-4 border-b'>Selected Materials</h4>
          {formData.selectedMaterials.length > 0 ? (
            <div>
              <div className='p-4 flex items-end space-x-4'>
                <div className='flex-grow'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Select Date
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    className='w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500'
                    placeholderText='Choose a date'
                  />
                </div>
                <button
                  onClick={handleUpdateAvailability}
                  className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 flex items-center'
                  disabled={
                    checkAvailabilityMutation.isLoading || !selectedDate
                  }
                >
                  {checkAvailabilityMutation.isLoading ? (
                    <Loader />
                  ) : (
                    <>
                      <RefreshCwIcon size={16} className='mr-2' />
                      Check Availability
                    </>
                  )}
                </button>
              </div>
              <ul className='divide-y divide-gray-200'>
                {formData.selectedMaterials.map((item) => (
                  <li key={item._id} className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center space-x-3'>
                        <img
                          src={item.imagePath}
                          alt={item.name}
                          className='w-12 h-12 object-cover rounded'
                        />
                        <div>
                          <p className='font-medium'>{item.name}</p>
                          {selectedDate ? (
                            availabilityChecked ? (
                              <p className='text-sm text-gray-500'>
                                Available on {selectedDate.toDateString()}:{' '}
                                {item.availableQuantity} items
                              </p>
                            ) : (
                              <p className='text-sm text-amber-500'>
                                Click "Check Availability" to see available
                                quantity
                              </p>
                            )
                          ) : (
                            <p className='text-sm text-amber-500'>
                              Please select a date first
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={(e) => handleQuantityChange(e, item._id, -1)}
                          className='w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full'
                          disabled={item.quantity === 1 || !availabilityChecked}
                        >
                          -
                        </button>
                        <span className='w-8 text-center'>{item.quantity}</span>
                        <button
                          onClick={(e) => handleQuantityChange(e, item._id, 1)}
                          className='w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full'
                          disabled={
                            item.quantity >= item.availableQuantity ||
                            !availabilityChecked
                          }
                        >
                          +
                        </button>
                        <button
                          onClick={(e) => handleRemoveItem(e, item._id)}
                          className='w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full'
                        >
                          <Trash2Icon size={16} />
                        </button>
                      </div>
                    </div>
                    {availabilityChecked &&
                      item.quantity > item.availableQuantity && (
                        <div className='flex items-center text-amber-600 text-sm mt-1'>
                          <AlertCircleIcon size={16} className='mr-1' />
                          Requested quantity exceeds availability for this date.
                        </div>
                      )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className='text-gray-500 italic p-4'>No items selected.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default MaterialsSection
