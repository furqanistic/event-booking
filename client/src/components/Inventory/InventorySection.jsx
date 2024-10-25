import {
  Calendar,
  Filter,
  Gift,
  ImageIcon,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash,
  X,
} from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useQuery, useQueryClient } from 'react-query'
import { axiosInstance } from '../../config'
import Layout from '../../pages/Layout'
import BulkUpdateInventory from './BulkUpdateInventory'

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg font-medium transition-all
      ${
        active
          ? 'bg-blue-50 text-blue-600 border border-blue-100'
          : 'text-gray-600 hover:bg-gray-50'
      }
    `}
  >
    {children}
  </button>
)

const ActionButton = ({ onClick, icon: Icon, label, color }) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-lg transition-colors ${color}`}
    title={label}
  >
    <Icon className='w-4 h-4' />
  </button>
)

const FormInput = ({ label, id, type = 'text', defaultValue, ...props }) => (
  <div className='space-y-1.5'>
    <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      defaultValue={defaultValue}
      className='w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
      {...props}
    />
  </div>
)

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-sm'>
      <div className='min-h-screen px-4 flex items-center justify-center'>
        <div className='bg-white w-full max-w-lg rounded-xl shadow-xl'>
          <div className='flex justify-between items-center px-6 py-4 border-b'>
            <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
            <button
              onClick={onClose}
              className='p-1 hover:bg-gray-100 rounded-full transition-colors'
            >
              <X className='w-5 h-5 text-gray-500' />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

const InventorySection = () => {
  const [activeTab, setActiveTab] = useState('materials')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  const { data: items, isLoading } = useQuery(activeTab, () =>
    axiosInstance.get(activeTab).then((res) => res.data.data.items)
  )

  const filteredItems = items?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const showNotification = useCallback((message, type = 'success') => {
    toast.dismiss()
    toast[type](message, {
      duration: 3000,
      position: 'top-center',
    })
  }, [])

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
      const { _id, name, imagePath, MaxQuantity, startDate, endDate } =
        updatedItem
      const response = await axiosInstance.patch(`${activeTab}/${_id}`, {
        name,
        imagePath,
        MaxQuantity,
        startDate,
        endDate,
      })
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

    itemData.MaxQuantity = parseInt(itemData.MaxQuantity, 10)

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

  const closeBulkUpdate = useCallback(() => {
    setIsBulkUpdateOpen(false)
    setCurrentItem(null)
  }, [])

  const renderTable = (items) => (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Item
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Image
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Quantity
              </th>
              <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {items?.map((item) => (
              <tr key={item._id} className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='font-medium text-gray-900'>{item.name}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {item.imagePath ? (
                    <img
                      src={item.imagePath}
                      alt={item.name}
                      className='h-10 w-10 rounded-lg object-cover'
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center'>
                      <ImageIcon className='w-5 h-5 text-gray-400' />
                    </div>
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {item.MaxQuantity || 0}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-center'>
                  <div className='flex items-center justify-center space-x-2'>
                    <ActionButton
                      onClick={() => openModal(item)}
                      icon={Pencil}
                      label='Edit'
                      color='hover:bg-blue-50 hover:text-blue-600'
                    />
                    <ActionButton
                      onClick={() => openBulkUpdate(item)}
                      icon={Calendar}
                      label='Bulk Update'
                      color='hover:bg-green-50 hover:text-green-600'
                    />
                    <ActionButton
                      onClick={() => handleDelete(item._id)}
                      icon={Trash}
                      label='Delete'
                      color='hover:bg-red-50 hover:text-red-600'
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Toaster />

        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-900'>
              Inventory Management
            </h1>
            <p className='mt-1 text-sm text-gray-500'>
              Manage your materials and merchandising items
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <Plus className='w-5 h-5 mr-2' />
            Add New Item
          </button>
        </div>

        {/* Filters & Search */}
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <TabButton
              active={activeTab === 'materials'}
              onClick={() => setActiveTab('materials')}
            >
              <Package className='w-4 h-4 inline-block mr-2' />
              Materials
            </TabButton>
            <TabButton
              active={activeTab === 'merchandising'}
              onClick={() => setActiveTab('merchandising')}
            >
              <Gift className='w-4 h-4 inline-block mr-2' />
              Merchandising
            </TabButton>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <Search className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
              <input
                type='text'
                placeholder='Search items...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
            </div>
            <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
              <Filter className='w-5 h-5 text-gray-500' />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='space-y-4'>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <Loader2 className='w-8 h-8 text-blue-500 animate-spin' />
            </div>
          ) : (
            renderTable(filteredItems)
          )}
        </div>

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={currentItem ? 'Edit Item' : 'Create New Item'}
        >
          <form onSubmit={handleSubmit} className='p-6 space-y-4'>
            <FormInput
              label='Name'
              id='name'
              defaultValue={currentItem?.name}
              required
            />
            <FormInput
              label='Image Path'
              id='imagePath'
              defaultValue={currentItem?.imagePath}
            />
            <FormInput
              label='Quantity'
              id='MaxQuantity'
              type='number'
              defaultValue={currentItem?.MaxQuantity || 0}
              min='0'
              required
            />
            {currentItem && (
              <>
                <FormInput
                  label='Start Date'
                  id='startDate'
                  type='date'
                  min={new Date().toISOString().split('T')[0]}
                />
                <FormInput
                  label='End Date'
                  id='endDate'
                  type='date'
                  min={new Date().toISOString().split('T')[0]}
                />
              </>
            )}
            <div className='flex justify-end space-x-3 pt-4'>
              <button
                type='button'
                onClick={closeModal}
                className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                {currentItem ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Bulk Update Modal */}
        {isBulkUpdateOpen && currentItem && (
          <BulkUpdateInventory
            itemId={currentItem._id}
            itemName={currentItem.name}
            onClose={closeBulkUpdate}
            showNotification={showNotification}
          />
        )}
      </div>
    </Layout>
  )
}

export default InventorySection
