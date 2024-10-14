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

  const DetailSection = ({ title, content }) => (
    <div className='mb-4'>
      <p className='text-sm font-medium text-gray-500'>{title}</p>
      <p className='mt-1'>{content}</p>
    </div>
  )

  return (
    <div id='event-details' className='bg-white p-6 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-4'>{details.title}</h2>

      {details.description && (
        <DetailSection title='Description' content={details.description} />
      )}

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <DetailSection
          title='Start'
          content={new Date(details.start).toLocaleString()}
        />
        <DetailSection
          title='End'
          content={new Date(details.end).toLocaleString()}
        />
      </div>

      {details.eventType && (
        <DetailSection title='Event Type' content={details.eventType} />
      )}

      {details.materials &&
        details.selectedMaterials &&
        details.selectedMaterials.length > 0 && (
          <div className='mb-4'>
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

      {details.trainer && <DetailSection title='Trainer' content='Yes' />}

      {details.merchandising &&
        details.selectedMerchandising &&
        details.selectedMerchandising.length > 0 && (
          <div className='mb-4'>
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
        <DetailSection title='Address' content={details.address} />
      )}

      {details.reference && (
        <DetailSection title='Reference' content={details.reference} />
      )}

      {details.destination && (
        <DetailSection title='Destination' content={details.destination} />
      )}

      {details.department && details.province && details.district && (
        <DetailSection
          title='Location'
          content={`Department: ${details.department}, Province: ${details.province}, District: ${details.district}`}
        />
      )}
    </div>
  )
}

export default EventDetails
