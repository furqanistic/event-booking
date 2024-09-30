import axios from 'axios'
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  MapPin,
  Package,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { axiosInstance } from '../config'

// Create an Axios instance

// Fetch events

// Delete event
const deleteEvent = async (eventId) => {
  await axiosInstance.delete(`/events/${eventId}`)
}

const EventsManagementPage = () => {
  const [expandedEventId, setExpandedEventId] = useState(null)
  const queryClient = useQueryClient()

  // Query for fetching events
  const {
    data: eventDetails,
    isLoading,
    error,
  } = useQuery('materials', async () => {
    const response = await axiosInstance.get('/events')
    console.log(response.data)
    return response.data
  })
  // Mutation for deleting an event
  const deleteMutation = useMutation(deleteEvent, {
    onSuccess: () => {
      // Invalidate and refetch the events query
      queryClient.invalidateQueries('eventDetails')
    },
  })

  const handleDeleteEvent = (eventId) => {
    deleteMutation.mutate(eventId)
  }

  const toggleEventDetails = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId)
  }

  if (isLoading)
    return <div className='text-center py-10'>Loading events...</div>
  if (error)
    return (
      <div className='text-center py-10 text-red-600'>
        Error loading events: {error.message}
      </div>
    )

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6 text-blue-800 flex items-center'>
          <Calendar className='mr-2' /> Events Management
        </h1>
        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full table-auto'>
              <thead className='bg-blue-600 text-white'>
                <tr>
                  <th className='px-6 py-3 text-left'>Event Type</th>
                  <th className='px-6 py-3 text-left'>Date</th>
                  <th className='px-6 py-3 text-left'>Location</th>
                  <th className='px-6 py-3 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {eventDetails.map((event) => (
                  <React.Fragment key={event._id}>
                    <tr className='border-b hover:bg-blue-50 transition-colors duration-200'>
                      <td className='px-6 py-4 font-medium'>
                        {event.eventType}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center'>
                          <Calendar className='mr-2 text-blue-600' size={18} />
                          {new Date(event.start).toLocaleDateString()} -{' '}
                          {new Date(event.end).toLocaleDateString()}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center'>
                          <MapPin className='mr-2 text-blue-600' size={18} />
                          {event.district}, {event.department}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <button
                          onClick={() => toggleEventDetails(event._id)}
                          className='text-blue-600 hover:text-blue-800 mr-3 flex items-center'
                        >
                          {expandedEventId === event._id ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                          <span className='ml-1'>
                            {expandedEventId === event._id ? 'Hide' : 'Details'}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className='text-red-600 hover:text-red-800 flex items-center'
                          disabled={deleteMutation.isLoading}
                        >
                          <Trash2 size={18} />
                          <span className='ml-1'>Delete</span>
                        </button>
                      </td>
                    </tr>
                    {expandedEventId === event._id && (
                      <tr>
                        <td colSpan='4' className='px-6 py-4 bg-blue-50'>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                              <h4 className='font-semibold text-lg mb-2 text-blue-800'>
                                Event Details
                              </h4>
                              <p className='flex items-center mb-2'>
                                <MapPin
                                  className='mr-2 text-blue-600'
                                  size={18}
                                />
                                <strong>Address:</strong> {event.address}
                              </p>
                              <p className='flex items-center mb-2'>
                                <Info
                                  className='mr-2 text-blue-600'
                                  size={18}
                                />
                                <strong>Province:</strong> {event.province}
                              </p>
                              <p className='flex items-center mb-2'>
                                <MapPin
                                  className='mr-2 text-blue-600'
                                  size={18}
                                />
                                <strong>Destination:</strong>{' '}
                                {event.destination}
                              </p>
                              {event.reference && (
                                <p className='flex items-center mb-2'>
                                  <Info
                                    className='mr-2 text-blue-600'
                                    size={18}
                                  />
                                  <strong>Reference:</strong> {event.reference}
                                </p>
                              )}
                            </div>
                            <div>
                              {event.materials && (
                                <div className='mb-4'>
                                  <h4 className='font-semibold text-lg mb-2 text-blue-800 flex items-center'>
                                    <Package className='mr-2' size={18} />
                                    Materials
                                  </h4>
                                  <ul className='list-disc list-inside pl-5'>
                                    {event.selectedMaterials.map((material) => (
                                      <li key={material.materialId}>
                                        {material.name} - Quantity:{' '}
                                        {material.quantity}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {event.merchandising && (
                                <div>
                                  <h4 className='font-semibold text-lg mb-2 text-blue-800 flex items-center'>
                                    <ShoppingBag className='mr-2' size={18} />
                                    Merchandising
                                  </h4>
                                  <ul className='list-disc list-inside pl-5'>
                                    {event.selectedMerchandising.map((item) => (
                                      <li key={item.merchandisingId}>
                                        {item.name} - Quantity: {item.quantity}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventsManagementPage
