import { addDays, format } from 'date-fns'
import {
  Building,
  Calendar,
  CalendarIcon,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Info,
  Loader,
  MapPin,
  Package,
  ShoppingBag,
  Trash2,
  User,
  User2,
} from 'lucide-react'
import React, { useState } from 'react'
import { destinationData } from '../../dataFile'

const calculateExtendedDate = (endDate, extendDays) => {
  if (!endDate || !extendDays) return null
  const date = new Date(endDate)
  return addDays(date, extendDays)
}

const getEventStatus = (start, end, destination, extendDate) => {
  const now = new Date()
  let endDate = new Date(end)

  // If extendDate exists, add those days to the end date for status calculation
  if (extendDate) {
    endDate = new Date(endDate.setDate(endDate.getDate() + extendDate))
  }

  const startDate = new Date(start)

  // Get destination data
  const destData = destinationData[destination?.toUpperCase()] || {
    daysToReach: 1,
    daysToReturn: 1,
    cleaningDays: 1,
  }

  // Calculate transit dates
  const transitStartDate = new Date(startDate)
  transitStartDate.setDate(startDate.getDate() - destData.daysToReach)

  const transitEndDate = new Date(endDate)
  transitEndDate.setDate(endDate.getDate() + destData.daysToReturn)

  // Calculate cleaning period
  const cleaningEndDate = new Date(transitEndDate)
  cleaningEndDate.setDate(cleaningEndDate.getDate() + destData.cleaningDays)

  // Determine status based on current date
  if (now < transitStartDate) {
    return { label: 'Upcoming', color: 'bg-purple-500' }
  }

  if (now >= transitStartDate && now < startDate) {
    return { label: 'In-Transit', color: 'bg-yellow-500' }
  }

  if (now >= startDate && now <= endDate) {
    return { label: 'Happening', color: 'bg-green-500' }
  }

  if (now > endDate && now <= transitEndDate) {
    return { label: 'In-Transit', color: 'bg-yellow-500' }
  }

  if (now > transitEndDate && now <= cleaningEndDate) {
    return { label: 'Cleaning', color: 'bg-blue-500' }
  }

  return { label: 'Completed', color: 'bg-gray-500' }
}

const DetailSection = ({ icon: Icon, title, content }) => (
  <div className='flex items-center space-x-2 text-sm mb-3'>
    <Icon className='text-gray-400 flex-shrink-0' size={16} />
    <span className='font-medium text-gray-600 min-w-[120px]'>{title}:</span>
    <span className='text-gray-600'>{content}</span>
  </div>
)

const ExtendDateDialog = ({
  show,
  onClose,
  onConfirm,
  currentEndDate,
  isExtending,
}) => {
  const [newEndDate, setNewEndDate] = useState('')
  const [extensionNote, setExtensionNote] = useState('')

  if (!show) return null

  const formatDateForInput = (date) => {
    return format(new Date(date), 'yyyy-MM-dd')
  }

  const calculateDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleConfirm = () => {
    if (!extensionNote.trim()) {
      alert('Please provide a note for the extension')
      return
    }
    const daysExtended = calculateDaysDifference(currentEndDate, newEndDate)

    // Convert to ISO string format for MongoDB
    const dateForMongo = new Date(newEndDate).toISOString()
    console.log('Selected date in ISO format:', dateForMongo) // Should show something like "2024-11-14T00:00:00.000Z"

    onConfirm({
      daysExtended: daysExtended,
      note: extensionNote,
      date: dateForMongo,
      newEndDate: newEndDate,
    })
    setNewEndDate('')
    setExtensionNote('')
  }

  const minDate = formatDateForInput(currentEndDate)

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          Extend Event End Date
        </h2>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Current End Date:{' '}
              {format(new Date(currentEndDate), 'MMM dd, yyyy')}
            </label>
            <input
              type='date'
              min={minDate}
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Extension Note
            </label>
            <textarea
              value={extensionNote}
              onChange={(e) => setExtensionNote(e.target.value)}
              placeholder='Please provide a reason for extending the event...'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24 resize-none'
              required
            />
          </div>
        </div>
        <div className='flex justify-end space-x-3 mt-6'>
          <button
            onClick={() => {
              onClose()
              setNewEndDate('')
              setExtensionNote('')
            }}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!newEndDate || !extensionNote.trim() || isExtending}
            className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
          >
            {isExtending ? (
              <>
                <Loader className='animate-spin' size={16} />
                <span>Extending...</span>
              </>
            ) : (
              <>
                <CalendarPlus size={16} />
                <span>Extend Date</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const ExtensionNotes = ({ extensionNotes }) => {
  console.log(extensionNotes)
  if (!extensionNotes || extensionNotes.length === 0) return null
  return (
    <div className='mb-6'>
      <h4 className='font-medium text-gray-900 mb-4 flex items-center space-x-2'>
        <CalendarPlus className='text-gray-400' size={16} />
        <span>Extension History</span>
      </h4>
      <div className='space-y-3'>
        {extensionNotes.map((note, index) => (
          <div
            key={index}
            className='bg-white rounded-lg p-4 border border-gray-100'
          >
            <div className='flex justify-between items-start mb-2'>
              <div className='text-sm'>
                <span className='text-gray-500'>Extended by: </span>{' '}
                <span className='font-medium text-gray-900'>
                  {note.createdBy?.name || 'System'}
                </span>{' '}
                <span className='text-indigo-600'>
                  {note.createdBy?.email ? `(${note.createdBy.email})` : ''}
                </span>
              </div>
              <div className='text-sm text-gray-500'>
                {format(new Date(note.date), 'MMM dd, yyyy')}
              </div>
            </div>
            <div className='text-sm text-gray-600 mb-2'>Note: {note.note}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MaterialsList = ({ materials, title, icon: Icon }) => {
  if (!materials || materials.length === 0) return null

  return (
    <div className='mb-6'>
      <h4 className='font-medium text-gray-900 mb-4 flex items-center space-x-2'>
        <Icon className='text-gray-400' size={16} />
        <span>{title}</span>
      </h4>
      <div className='bg-white rounded-lg p-4 border border-gray-100'>
        <ul className='space-y-2'>
          {materials.map((item) => (
            <li
              key={item.materialId || item.merchandisingId}
              className='text-sm text-gray-600 flex items-center space-x-3'
            >
              <div className='w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0'></div>
              <span className='font-medium'>{item.name}</span>
              <span className='text-gray-500'>Quantity: {item.quantity}</span>
              <span className='text-gray-500'>
                Added: {format(new Date(item.date), 'MMM dd, yyyy')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const EventCard = ({
  event,
  isExpanded,
  onToggleDetails,
  onDeleteClick,
  onExtendDate,
  deletingEventId,
  extendingEventId,
}) => {
  const [showExtendDialog, setShowExtendDialog] = useState(false)

  // Calculate the extended end date
  const extendedEndDate = calculateExtendedDate(event.end, event.extendDate)

  const handleExtendConfirm = async (data) => {
    try {
      console.log('Date in EventCard:', data.date) // Debug log
      await onExtendDate(event._id, {
        daysExtended: data.daysExtended,
        note: data.note,
        date: data.date, // Pass through the exact date
      })
      setShowExtendDialog(false)
    } catch (error) {
      console.error('Failed to extend event date:', error)
    }
  }

  const status = getEventStatus(
    event.start,
    extendedEndDate || event.end,
    event.destination,
    event.extendDate
  )

  return (
    <>
      <div className='bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden transition-all duration-200 hover:shadow-md'>
        {/* Card Header */}
        <div className='grid grid-cols-6 p-4 items-center'>
          {/* Event Title and Type */}
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-indigo-50 rounded-lg'>
              <Calendar className='text-indigo-600' size={20} />
            </div>
            <div>
              <p className='font-medium text-gray-900'>{event.title}</p>
              <p className='text-sm text-gray-500'>{event.eventType}</p>
            </div>
          </div>

          {/* Date Range */}
          <div className='flex items-center space-x-2'>
            <CalendarIcon className='text-gray-400' size={16} />
            <div className='flex flex-col'>
              <span className='text-sm'>
                {format(new Date(event.start), 'MMM dd, yyyy')} -{' '}
                {format(new Date(event.end), 'MMM dd, yyyy')}
              </span>
              {event.extensionNotes && event.extensionNotes.length > 0 && (
                <span className='text-xs text-red-600'>
                  Extended until:{' '}
                  {format(
                    new Date(
                      event.extensionNotes[event.extensionNotes.length - 1].date
                    ),
                    'MMM dd, yyyy'
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className='flex items-center space-x-2'>
            <MapPin className='text-gray-400' size={16} />
            <span className='text-sm'>
              {event.district}, {event.department}
            </span>
          </div>

          {/* Status */}
          <div className='flex items-center'>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color} text-white`}
            >
              {status.label}
            </span>
          </div>

          {/* Creator */}
          <div className='flex items-center space-x-2'>
            <User className='text-gray-400' size={16} />
            <span className='text-sm'>{event.creator?.name || 'System'}</span>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end space-x-4'>
            <button
              onClick={() => setShowExtendDialog(true)}
              className='px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 rounded-md hover:bg-indigo-50 transition-colors duration-200 flex items-center space-x-1'
            >
              <CalendarPlus size={16} />
              <span>Extend</span>
            </button>

            <button
              onClick={() => onToggleDetails(event._id)}
              className='px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 rounded-md hover:bg-indigo-50 transition-colors duration-200 flex items-center space-x-1'
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <span>{isExpanded ? 'Hide' : 'Details'}</span>
            </button>

            {deletingEventId === event._id ? (
              <div className='flex items-center text-red-600 space-x-2'>
                <Loader className='animate-spin' size={16} />
                <span className='text-sm'>Deleting...</span>
              </div>
            ) : (
              <button
                onClick={() => onDeleteClick(event._id)}
                className='px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 rounded-md hover:bg-red-50 transition-colors duration-200 flex items-center space-x-1'
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className='p-6 bg-gray-50 border-t border-gray-100'>
            <div className='grid grid-cols-2 gap-8'>
              {/* Left Column */}
              <div>
                {/* Basic Information */}
                <div className='mb-6'>
                  <h4 className='font-medium text-gray-900 mb-4 flex items-center space-x-2'>
                    <FileText className='text-gray-400' size={16} />
                    <span>Basic Information</span>
                  </h4>
                  {event.description && (
                    <div className='mb-4'>
                      <p className='text-sm font-medium text-gray-600 mb-1'>
                        Description
                      </p>
                      <p className='text-sm text-gray-600'>
                        {event.description}
                      </p>
                    </div>
                  )}
                  <DetailSection
                    icon={Clock}
                    title='Start Date'
                    content={format(
                      new Date(event.start),
                      'MMM dd, yyyy HH:mm'
                    )}
                  />
                  <DetailSection
                    icon={Clock}
                    title='End Date'
                    content={
                      <>
                        {format(new Date(event.end), 'MMM dd, yyyy HH:mm')}
                        {event.extensionNotes &&
                          event.extensionNotes.length > 0 && (
                            <span className='ml-2 text-indigo-600'>
                              (Extended until:{' '}
                              {format(
                                new Date(
                                  event.extensionNotes[
                                    event.extensionNotes.length - 1
                                  ].date
                                ),
                                'MMM dd, yyyy HH:mm'
                              )}
                              )
                            </span>
                          )}
                      </>
                    }
                  />
                  <DetailSection
                    icon={Calendar}
                    title='Event Type'
                    content={event.eventType}
                  />
                </div>

                {/* Location Details */}
                <div className='mb-6'>
                  <h4 className='font-medium text-gray-900 mb-4 flex items-center space-x-2'>
                    <Building className='text-gray-400' size={16} />
                    <span>Location Details</span>
                  </h4>
                  <DetailSection
                    icon={MapPin}
                    title='Address'
                    content={event.address}
                  />
                  <DetailSection
                    icon={MapPin}
                    title='Department'
                    content={event.department}
                  />
                  <DetailSection
                    icon={MapPin}
                    title='Province'
                    content={event.province}
                  />
                  <DetailSection
                    icon={MapPin}
                    title='District'
                    content={event.district}
                  />
                  {event.destination && (
                    <DetailSection
                      icon={MapPin}
                      title='Destination'
                      content={event.destination}
                    />
                  )}
                  {event.reference && (
                    <DetailSection
                      icon={Info}
                      title='Reference'
                      content={event.reference}
                    />
                  )}
                </div>

                {/* Extension Notes */}
                {event.extensionNotes && event.extensionNotes.length > 0 && (
                  <ExtensionNotes extensionNotes={event.extensionNotes} />
                )}
              </div>

              {/* Right Column */}
              <div>
                {/* Materials Section */}
                {event.materials &&
                  event.selectedMaterials &&
                  event.selectedMaterials.length > 0 && (
                    <MaterialsList
                      materials={event.selectedMaterials}
                      title='Materials'
                      icon={Package}
                    />
                  )}

                {/* Merchandising Section */}
                {event.merchandising &&
                  event.selectedMerchandising &&
                  event.selectedMerchandising.length > 0 && (
                    <MaterialsList
                      materials={event.selectedMerchandising}
                      title='Merchandising'
                      icon={ShoppingBag}
                    />
                  )}

                {/* Status Details */}
                <div className='mb-6'>
                  <h4 className='font-medium text-gray-900 mb-4 flex items-center space-x-2'>
                    <Info className='text-gray-400' size={16} />
                    <span>Status Information</span>
                  </h4>
                  <div className='bg-white rounded-lg p-4 border border-gray-100'>
                    <div className='flex items-center space-x-2 mb-3'>
                      <div
                        className={`w-3 h-3 rounded-full ${status.color}`}
                      ></div>
                      <span className='text-sm font-medium text-gray-900'>
                        {status.label}
                      </span>
                    </div>
                    <p className='text-sm text-gray-600'>
                      This event is currently {status.label.toLowerCase()}
                      {status.label === 'In-Transit' && ' to its destination'}
                      {status.label === 'Happening' &&
                        ' at the specified location'}
                      {status.label === 'Cleaning' &&
                        ' through post-event procedures'}
                    </p>
                  </div>
                </div>

                {/* Creation Details */}
                <div className='mb-6'>
                  <h4 className='font-medium text-gray-900 mb-4 flex items-center space-x-2'>
                    <User2 className='text-gray-400' size={16} />
                    <span>Creation Details</span>
                  </h4>
                  <div className='bg-white rounded-lg p-4 border border-gray-100'>
                    <DetailSection
                      icon={User}
                      title='Created By'
                      content={event.creator?.name || 'System'}
                    />
                    <DetailSection
                      icon={Calendar}
                      title='Created At'
                      content={format(
                        new Date(event.createdAt),
                        'MMM dd, yyyy HH:mm'
                      )}
                    />
                    {event.updatedAt && (
                      <DetailSection
                        icon={Calendar}
                        title='Last Updated'
                        content={format(
                          new Date(event.updatedAt),
                          'MMM dd, yyyy HH:mm'
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Extend Date Dialog */}
      <ExtendDateDialog
        show={showExtendDialog}
        onClose={() => setShowExtendDialog(false)}
        onConfirm={handleExtendConfirm}
        currentEndDate={extendedEndDate || event.end}
        isExtending={extendingEventId === event._id}
      />
    </>
  )
}

export default EventCard
