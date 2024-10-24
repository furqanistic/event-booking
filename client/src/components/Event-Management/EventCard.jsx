import {
  Building,
  Calendar,
  CalendarIcon,
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
import React from 'react'

const DetailSection = ({ icon: Icon, title, content }) => (
  <div className='flex items-center space-x-2 text-sm mb-3'>
    <Icon className='text-gray-400 flex-shrink-0' size={16} />
    <span className='font-medium text-gray-600 min-w-[120px]'>{title}:</span>
    <span className='text-gray-600'>{content}</span>
  </div>
)

const EventCard = ({
  event,
  isExpanded,
  onToggleDetails,
  onDeleteClick,
  deletingEventId,
}) => {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden transition-all duration-200 hover:shadow-md'>
      <div className='grid grid-cols-5 p-4 items-center'>
        <div className='flex items-center space-x-3'>
          <div className='p-2 bg-indigo-50 rounded-lg'>
            <Calendar className='text-indigo-600' size={20} />
          </div>
          <div>
            <p className='font-medium text-gray-900'>{event.title}</p>
            <p className='text-sm text-gray-500'>{event.eventType}</p>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <CalendarIcon className='text-gray-400' size={16} />
          <span className='text-sm'>
            {new Date(event.start).toLocaleDateString()} -{' '}
            {new Date(event.end).toLocaleDateString()}
          </span>
        </div>

        <div className='flex items-center space-x-2'>
          <MapPin className='text-gray-400' size={16} />
          <span className='text-sm'>
            {event.district}, {event.department}
          </span>
        </div>

        <div className='flex items-center space-x-2'>
          <User className='text-gray-400' size={16} />
          <span className='text-sm'>{event.createdBy || 'System'}</span>
        </div>

        <div className='flex items-center justify-end space-x-4'>
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

      {isExpanded && (
        <div className='p-6 bg-gray-50 border-t border-gray-100'>
          <div className='grid grid-cols-2 gap-8'>
            <div>
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
                    <p className='text-sm text-gray-600'>{event.description}</p>
                  </div>
                )}
                <DetailSection
                  icon={Clock}
                  title='Start Date'
                  content={new Date(event.start).toLocaleString()}
                />
                <DetailSection
                  icon={Clock}
                  title='End Date'
                  content={new Date(event.end).toLocaleString()}
                />
                <DetailSection
                  icon={Calendar}
                  title='Event Type'
                  content={event.eventType}
                />
                {event.trainer && (
                  <DetailSection icon={User2} title='Trainer' content='Yes' />
                )}
              </div>

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
            </div>

            <div>
              {event.materials &&
                event.selectedMaterials &&
                event.selectedMaterials.length > 0 && (
                  <div className='mb-6'>
                    <h4 className='font-medium text-gray-900 mb-4 flex items-center space-x-2'>
                      <Package className='text-gray-400' size={16} />
                      <span>Materials</span>
                    </h4>
                    <div className='bg-white rounded-lg p-4 border border-gray-100'>
                      <ul className='space-y-2'>
                        {event.selectedMaterials.map((material) => (
                          <li
                            key={material.materialId}
                            className='text-sm text-gray-600 flex items-center space-x-3'
                          >
                            <div className='w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0'></div>
                            <span className='font-medium'>{material.name}</span>
                            <span className='text-gray-500'>
                              Quantity: {material.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              {event.merchandising &&
                event.selectedMerchandising &&
                event.selectedMerchandising.length > 0 && (
                  <div className='mb-6'>
                    <h4 className='font-medium text-gray-900 mb-4 flex items-center space-x-2'>
                      <ShoppingBag className='text-gray-400' size={16} />
                      <span>Merchandising</span>
                    </h4>
                    <div className='bg-white rounded-lg p-4 border border-gray-100'>
                      <ul className='space-y-2'>
                        {event.selectedMerchandising.map((item) => (
                          <li
                            key={item.merchandisingId}
                            className='text-sm text-gray-600 flex items-center space-x-3'
                          >
                            <div className='w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0'></div>
                            <span className='font-medium'>{item.name}</span>
                            <span className='text-gray-500'>
                              Quantity: {item.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventCard
