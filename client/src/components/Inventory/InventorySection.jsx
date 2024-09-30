import { CalendarIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useQuery, useQueryClient } from 'react-query'
import { axiosInstance } from '../../config'
import EventsManagementPage from '../../pages/EventsManagementPage'
import Layout from '../../pages/Layout'
import BulkUpdateInventory from './BulkUpdateInventory'

const InventorySection = () => {
  const [activeTab, setActiveTab] = useState('materials')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const queryClient = useQueryClient()

  const { data: materials, isLoading: isMaterialsLoading } = useQuery(
    'materials',
    () => axiosInstance.get('materials').then((res) => res.data.data.items)
  )

  const { data: merchandising, isLoading: isMerchandisingLoading } = useQuery(
    'merchandising',
    () => axiosInstance.get('merchandising').then((res) => res.data.data.items)
  )

  const showNotification = (message, type = 'success') => {
    toast.dismiss()
    toast[type](message, {
      duration: 3000,
      position: 'top-center',
    })
  }

  const handleCreate = async (newItem) => {
    try {
      await axiosInstance.post(`${activeTab}`, newItem)
      await queryClient.invalidateQueries(activeTab)
      closeModal()
      showNotification('Item created successfully')
    } catch (error) {
      console.error('Error creating item:', error)
      showNotification('Failed to create item', 'error')
    }
  }

  const handleUpdate = async (updatedItem) => {
    try {
      await axiosInstance.patch(`${activeTab}/${updatedItem._id}`, updatedItem)
      await queryClient.invalidateQueries(activeTab)
      closeModal()
      showNotification('Item updated successfully')
    } catch (error) {
      console.error('Error updating item:', error)
      showNotification('Failed to update item', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${activeTab}/${id}`)
      await queryClient.invalidateQueries(activeTab)
      showNotification('Item deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      showNotification('Failed to delete item', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const itemData = Object.fromEntries(formData.entries())

    // Process availability data
    const availability = []
    const dates = formData.getAll('date')
    const quantities = formData.getAll('quantity')
    for (let i = 0; i < dates.length; i++) {
      if (dates[i] && quantities[i]) {
        availability.push({ date: dates[i], quantity: parseInt(quantities[i]) })
      }
    }
    itemData.availability = availability

    if (currentItem) {
      await handleUpdate({ ...currentItem, ...itemData })
    } else {
      await handleCreate(itemData)
    }
  }

  const openModal = (item = null) => {
    setCurrentItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentItem(null)
  }

  const openBulkUpdate = (item) => {
    setCurrentItem(item)
    setIsBulkUpdateOpen(true)
  }

  const closeBulkUpdate = () => {
    setIsBulkUpdateOpen(false)
    setCurrentItem(null)
  }

  const renderTable = (items) => (
    <div className='overflow-x-auto'>
      <table className='min-w-full bg-white'>
        <thead>
          <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
            <th className='py-3 px-6 text-left'>Name</th>
            <th className='py-3 px-6 text-left'>Image</th>
            <th className='py-3 px-6 text-center'>Actions</th>
          </tr>
        </thead>
        <tbody className='text-gray-600 text-sm font-light'>
          {items &&
            items.map((item) => (
              <tr
                key={item._id}
                className='border-b border-gray-200 hover:bg-gray-100'
              >
                <td className='py-3 px-6 text-left whitespace-nowrap'>
                  {item.name}
                </td>
                <td className='py-3 px-6 text-left'>
                  {item.imagePath && (
                    <img
                      src={item.imagePath}
                      alt={item.name}
                      className='h-10 w-10 rounded-full'
                    />
                  )}
                </td>
                <td className='py-3 px-6 text-center'>
                  <div className='flex item-center justify-center'>
                    <button
                      onClick={() => openModal(item)}
                      className='w-4 mr-2 transform hover:text-purple-500 hover:scale-110'
                      title='Edit'
                    >
                      <PencilIcon size={16} />
                    </button>
                    <button
                      onClick={() => openBulkUpdate(item)}
                      className='w-4 mr-2 transform hover:text-blue-500 hover:scale-110'
                      title='Bulk Update Inventory'
                    >
                      <CalendarIcon size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className='w-4 mr-2 transform hover:text-red-500 hover:scale-110'
                      title='Delete'
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <Layout>
      <div className='container mx-auto px-4 sm:px-8'>
        <Toaster position='top-right' />
        <div className='py-8'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-semibold leading-tight'>
              Inventory Management
            </h2>
            <button
              onClick={() => openModal()}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              <PlusIcon className='inline-block mr-2' size={16} />
              Add New Item
            </button>
          </div>
          <div className='my-2 flex sm:flex-row flex-col'>
            <div className='flex flex-row mb-1 sm:mb-0'>
              <button
                onClick={() => setActiveTab('materials')}
                className={`${
                  activeTab === 'materials'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-blue-500'
                } border border-blue-500 font-bold py-2 px-4 rounded-l`}
              >
                Materials
              </button>
              <button
                onClick={() => setActiveTab('merchandising')}
                className={`${
                  activeTab === 'merchandising'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-blue-500'
                } border border-blue-500 font-bold py-2 px-4 rounded-r`}
              >
                Merchandising
              </button>
            </div>
          </div>
          <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
            {activeTab === 'materials' &&
              (isMaterialsLoading ? <p>Loading...</p> : renderTable(materials))}
            {activeTab === 'merchandising' &&
              (isMerchandisingLoading ? (
                <p>Loading...</p>
              ) : (
                renderTable(merchandising)
              ))}
          </div>
        </div>

        {isModalOpen && (
          <div className='fixed z-10 inset-0 overflow-y-auto'>
            <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
              <div
                className='fixed inset-0 transition-opacity'
                aria-hidden='true'
              >
                <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
              </div>
              <span
                className='hidden sm:inline-block sm:align-middle sm:h-screen'
                aria-hidden='true'
              >
                &#8203;
              </span>
              <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
                <form onSubmit={handleSubmit}>
                  <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                    <div className='mb-4'>
                      <label
                        htmlFor='name'
                        className='block text-gray-700 text-sm font-bold mb-2'
                      >
                        Name
                      </label>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        defaultValue={currentItem?.name}
                        required
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      />
                    </div>
                    <div className='mb-4'>
                      <label
                        htmlFor='imagePath'
                        className='block text-gray-700 text-sm font-bold mb-2'
                      >
                        Image Path
                      </label>
                      <input
                        type='text'
                        id='imagePath'
                        name='imagePath'
                        defaultValue={currentItem?.imagePath}
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      />
                    </div>
                  </div>
                  <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                    <button
                      type='submit'
                      className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm'
                    >
                      {currentItem ? 'Update' : 'Create'}
                    </button>
                    <button
                      type='button'
                      onClick={closeModal}
                      className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {isBulkUpdateOpen && currentItem && (
          <BulkUpdateInventory
            itemId={currentItem._id}
            itemName={currentItem.name}
            onClose={closeBulkUpdate}
          />
        )}
      </div>
    </Layout>
  )
}

export default InventorySection
