import {
  AlertCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { merchandisingItems } from '../../dataFile'

const MerchandisingSection = ({ formData, setFormData }) => {
  const [merchandisingTab, setMerchandisingTab] = useState('find')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [limitMessages, setLimitMessages] = useState({})
  const itemsPerPage = 5

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleItemToggle = (itemId) => {
    setFormData((prevState) => {
      const item = merchandisingItems.find((i) => i.id === itemId)
      const updatedItems = prevState.selectedMerchandising.some(
        (i) => i.id === itemId
      )
        ? prevState.selectedMerchandising.filter((i) => i.id !== itemId)
        : [...prevState.selectedMerchandising, { ...item, quantity: 1 }]
      return { ...prevState, selectedMerchandising: updatedItems }
    })
  }

  const handleQuantityChange = (itemId, change) => {
    setFormData((prevState) => {
      const updatedItems = prevState.selectedMerchandising.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(
            1,
            Math.min(item.quantity + change, item.available)
          )
          return { ...item, quantity: newQuantity }
        }
        return item
      })
      return { ...prevState, selectedMerchandising: updatedItems }
    })
  }

  const handleQuantityLimitExceeded = (itemId) => {
    const item = formData.selectedMerchandising.find((i) => i.id === itemId)
    setLimitMessages((prev) => ({
      ...prev,
      [itemId]: `Max ${item.available} available`,
    }))
    setTimeout(() => {
      setLimitMessages((prev) => ({ ...prev, [itemId]: null }))
    }, 3000)
  }

  const handleRemoveItem = (itemId) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedMerchandising: prevState.selectedMerchandising.filter(
        (item) => item.id !== itemId
      ),
    }))
    setLimitMessages((prev) => ({ ...prev, [itemId]: null }))
  }

  const filteredItems = merchandisingItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleTabChange = (tab) => {
    setMerchandisingTab(tab)
  }

  const MerchandisingList = () => (
    <div className='space-y-2'>
      {currentItems.map((item) => (
        <div
          key={item.id}
          className='flex items-center justify-between p-2 border border-gray-200 rounded-md'
        >
          <div className='flex items-center space-x-2'>
            <img
              src={item.image}
              alt={item.name}
              className='w-12 h-12 object-cover rounded'
            />
            <div>
              <p className='font-medium'>{item.name}</p>
              <p className='text-sm text-gray-500'>
                {item.available} available(s)
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => handleItemToggle(item.id)}
            className={`w-8 h-8 flex items-center justify-center ${
              formData.selectedMerchandising.some((i) => i.id === item.id)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            } rounded-md`}
          >
            {formData.selectedMerchandising.some((i) => i.id === item.id)
              ? '-'
              : '+'}
          </button>
        </div>
      ))}
    </div>
  )

  return (
    <div className='space-y-4 border border-gray-200 rounded-md p-4'>
      <h3 className='font-medium text-gray-700'>Merchandising</h3>
      <div className='flex border-b'>
        <button
          className={`flex-1 py-2 ${
            merchandisingTab === 'find' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={(e) => {
            e.preventDefault()
            handleTabChange('find')
          }}
        >
          Find
        </button>
        <button
          className={`flex-1 py-2 ${
            merchandisingTab === 'request' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={(e) => {
            e.preventDefault()
            handleTabChange('request')
          }}
        >
          Your request
        </button>
      </div>
      {merchandisingTab === 'find' && (
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
          <MerchandisingList />
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
      {merchandisingTab === 'request' && (
        <div className='bg-white rounded-md shadow-sm'>
          <h4 className='font-medium p-4 border-b'>Selected Merchandising</h4>
          {formData.selectedMerchandising.length > 0 ? (
            <ul className='divide-y divide-gray-200'>
              {formData.selectedMerchandising.map((item) => (
                <li
                  key={item.id}
                  className='p-4 flex items-center justify-between'
                >
                  <div className='flex items-center space-x-3'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-12 h-12 object-cover rounded'
                    />
                    <div>
                      <p className='font-medium'>{item.name}</p>
                      <p className='text-sm text-gray-500'>
                        Available: {item.available}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleQuantityChange(item.id, -1)
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
                        if (item.quantity < item.available) {
                          handleQuantityChange(item.id, 1)
                        } else {
                          handleQuantityLimitExceeded(item.id)
                        }
                      }}
                      className='w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full'
                    >
                      <PlusIcon size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemoveItem(item.id)
                      }}
                      className='w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full'
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>
                  {limitMessages[item.id] && (
                    <div className='flex items-center text-amber-600 text-sm mt-1'>
                      <AlertCircleIcon size={16} className='mr-1' />
                      {limitMessages[item.id]}
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

export default MerchandisingSection