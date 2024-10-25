import { Info, MapPin, Package, X } from 'lucide-react'
import React from 'react'

const EventDetails = ({ event, onClose }) => {
  if (!event) return null

  return (
    <div className='flex flex-col h-full bg-white'>
      {/* Header */}
      <div className='flex items-center justify-between px-6 py-4 border-b'>
        <button
          onClick={onClose}
          className='p-1 hover:bg-gray-100 rounded-full'
          aria-label='Close'
        >
          <X className='w-5 h-5 text-gray-500' />
        </button>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto'>
        {/* Status & Title */}
        <div className='px-6 py-4'>
          <span className='inline-block px-3 py-1 text-sm text-purple-700 bg-purple-50 rounded-full'>
            Upcoming
          </span>
          <h2 className='mt-2 text-2xl text-gray-900'>{event.title}</h2>
        </div>

        {/* Time Section */}
        <div className='px-6 space-y-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='text-indigo-600 mb-1'>Start Time</div>
              <div>{event.start}</div>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='text-indigo-600 mb-1'>End Time</div>
              <div>{event.end}</div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className='flex gap-3'>
              <Info className='w-5 h-5 text-gray-400 flex-shrink-0 mt-1' />
              <div>
                <div className='text-gray-600 mb-1'>Description</div>
                <div className='text-gray-900'>{event.description}</div>
              </div>
            </div>
          )}

          {/* Event Type */}
          {event.eventType && (
            <div className='flex gap-3'>
              <Info className='w-5 h-5 text-gray-400 flex-shrink-0 mt-1' />
              <div>
                <div className='text-gray-600 mb-1'>Event Type</div>
                <span className='inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-full'>
                  {event.eventType}
                </span>
              </div>
            </div>
          )}

          {/* Materials */}
          {event.selectedMaterials?.length > 0 && (
            <div className='flex gap-3'>
              <Package className='w-5 h-5 text-gray-400 flex-shrink-0 mt-1' />
              <div className='flex-1'>
                <div className='text-gray-600 mb-1'>Materials</div>
                {event.selectedMaterials.map((item, index) => (
                  <div
                    key={item.id || index}
                    className='flex justify-between items-center py-2'
                  >
                    <span>{item.name}</span>
                    <span className='text-indigo-600'>
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {(event.address || event.department) && (
            <div className='flex gap-3'>
              <MapPin className='w-5 h-5 text-gray-400 flex-shrink-0 mt-1' />
              <div>
                <div className='text-gray-600 mb-1'>Location Details</div>
                {event.address && (
                  <div className='text-gray-900'>{event.address}</div>
                )}
                {event.department && (
                  <div className='text-gray-600 mt-1'>
                    {event.department} {event.province && `• ${event.province}`}{' '}
                    {event.district && `• ${event.district}`}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className='px-6 py-4 border-t'>
        <button
          className='w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors'
          onClick={() => window.print()} // Or your PDF save logic
        >
          Save as PDF
        </button>
      </div>
    </div>
  )
}

export default EventDetails
