import {
  AlertCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
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
  const [limitMessages, setLimitMessages] = useState({})
  const itemsPerPage = 5

  const {
    data: materialsData,
    isLoading,
    error,
  } = useQuery('materials', async () => {
    const response = await axiosInstance.get('/materials')
    return response.data.data.items
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleItemToggle = (itemId) => {
    setFormData((prevState) => {
      const item = materialsData.find((i) => i._id === itemId)
      const updatedItems = prevState.selectedMaterials.some(
        (i) => i._id === itemId
      )
        ? prevState.selectedMaterials.filter((i) => i._id !== itemId)
        : [...prevState.selectedMaterials, { ...item, quantity: 1 }]
      return { ...prevState, selectedMaterials: updatedItems }
    })
  }

  const handleQuantityChange = (itemId, change) => {
    setFormData((prevState) => {
      const updatedItems = prevState.selectedMaterials.map((item) => {
        if (item._id === itemId) {
          const newQuantity = Math.max(
            1,
            Math.min(item.quantity + change, item.totalQuantity)
          )
          return { ...item, quantity: newQuantity }
        }
        return item
      })
      return { ...prevState, selectedMaterials: updatedItems }
    })
  }

  const handleQuantityLimitExceeded = (itemId) => {
    const item = formData.selectedMaterials.find((i) => i._id === itemId)
    setLimitMessages((prev) => ({
      ...prev,
      [itemId]: `Max ${item.totalQuantity} available`,
    }))
    setTimeout(() => {
      setLimitMessages((prev) => ({ ...prev, [itemId]: null }))
    }, 3000)
  }

  const handleRemoveItem = (itemId) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedMaterials: prevState.selectedMaterials.filter(
        (item) => item._id !== itemId
      ),
    }))
    setLimitMessages((prev) => ({ ...prev, [itemId]: null }))
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
                <p className='text-sm text-gray-500'>
                  {item.totalQuantity} available(s)
                </p>
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
                        <p className='text-sm text-gray-500'>
                          Available: {item.totalQuantity}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleQuantityChange(item._id, -1)
                        }}
                        className='w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full'
                        disabled={item.quantity === 1}
                      >
                        <MinusIcon size={16} />
                      </button>
                      <span className='w-8 text-center'>{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          if (item.quantity < item.totalQuantity) {
                            handleQuantityChange(item._id, 1)
                          } else {
                            handleQuantityLimitExceeded(item._id)
                          }
                        }}
                        className='w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full'
                      >
                        <PlusIcon size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleRemoveItem(item._id)
                        }}
                        className='w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full'
                      >
                        <Trash2Icon size={16} />
                      </button>
                    </div>
                  </div>
                  {limitMessages[item._id] && (
                    <div className='flex items-center text-amber-600 text-sm mt-1'>
                      <AlertCircleIcon size={16} className='mr-1' />
                      {limitMessages[item._id]}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500 italic p-4'>No items selected.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default MaterialsSection
