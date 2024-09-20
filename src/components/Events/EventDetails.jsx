const EventDetails = ({ event }) => {
  if (!event) return null

  if (!event) return null

  console.log('Event object:', event)
  console.log('Event details:', event.details)

  const details = event.details || {}

  return (
    <div id='event-details' className='p-6 space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <p className='text-sm font-medium text-gray-500'>Start</p>
          <p className='mt-1'>{new Date(event.start).toLocaleString()}</p>
        </div>
        <div>
          <p className='text-sm font-medium text-gray-500'>End</p>
          <p className='mt-1'>{new Date(event.end).toLocaleString()}</p>
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
              {details.selectedMaterials.map((material, index) => (
                <li key={index}>
                  {material.name} - Quantity: {material.quantity}
                </li>
              ))}
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
              {details.selectedMerchandising.map((item, index) => (
                <li key={index}>
                  {item.name} - Quantity: {item.quantity}
                </li>
              ))}
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
