import React from 'react'
import { materials, merchandisingItems } from '../../dataFile'

const EventDetails = ({ event, onClose }) => {
  if (!event) return null
  const details = event || {}
  // Helper function to get merchandising item by id
  const getMerchandisingItem = (id) => {
    return merchandisingItems.find((item) => item.id === id)
  }

  // Helper function to get material item by id
  const getMaterialItem = (id) => {
    return materials.find((item) => item.id === id)
  }

  return (
    <div id='event-details'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <p className='text-sm font-medium text-gray-500'>Start</p>
          <p className='mt-1'>{new Date(details.start).toLocaleString()}</p>
        </div>
        <div>
          <p className='text-sm font-medium text-gray-500'>End</p>
          <p className='mt-1'>{new Date(details.end).toLocaleString()}</p>
        </div>
      </div>
      {details.eventType && (
        <div>
          <p className='text-sm font-medium text-gray-500'>Event Type</p>
          <p className='mt-1'>{details.eventType}</p>
        </div>
      )}
      {details.materials &&
        details.selectedMaterials &&
        details.selectedMaterials.length > 0 && (
          <div>
            <p className='text-sm font-medium text-gray-500'>Materials</p>
            <ul className='list-disc pl-5 mt-1'>
              {details.selectedMaterials.map((item, index) => {
                const material = getMaterialItem(item.id)
                return (
                  <li key={index}>
                    {item.name} (Quantity: {item.quantity})
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      {details.trainer && (
        <div>
          <p className='text-sm font-medium text-gray-500'>Trainer</p>
          <p className='mt-1'>Yes</p>
        </div>
      )}
      {details.merchandising &&
        details.selectedMerchandising &&
        details.selectedMerchandising.length > 0 && (
          <div>
            <p className='text-sm font-medium text-gray-500'>Merchandising</p>
            <ul className='list-disc pl-5 mt-1'>
              {details.selectedMerchandising.map((item, index) => {
                const merchandisingItem = getMerchandisingItem(item.id)
                return (
                  <li key={index}>
                    {item.name} (Quantity: {item.quantity})
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      {details.address && (
        <div>
          <p className='text-sm font-medium text-gray-500'>Address</p>
          <p className='mt-1'>{details.address}</p>
        </div>
      )}
      {details.reference && (
        <div>
          <p className='text-sm font-medium text-gray-500'>Reference</p>
          <p className='mt-1'>{details.reference}</p>
        </div>
      )}
      {/* New Destination field */}
      {details.destination && (
        <div>
          <p className='text-sm font-medium text-gray-500'>Destination</p>
          <p className='mt-1'>{details.destination}</p>
        </div>
      )}
      {details.department && details.province && details.district && (
        <div>
          <p className='text-sm font-medium text-gray-500'>Location</p>
          <p className='mt-1'>
            Department: {details.department}, Province: {details.province},
            District: {details.district}
          </p>
        </div>
      )}
    </div>
  )
}

export default EventDetails
