import {
  Calendar,
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  Info,
  Loader,
  MapPin,
  Package,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { axiosInstance } from '../config'
import Layout from './Layout'

// Fetch events

const fetchEvents = async () => {
  const response = await axiosInstance.get('/events')
  return response.data.data.events
}

// Delete event
const deleteEvent = async (eventId) => {
  await axiosInstance.delete(`/events/${eventId}`)
  return eventId // Return the deleted event ID
}

const EventsManagementPage = () => {
  const [expandedEventId, setExpandedEventId] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    eventId: null,
  })
  const queryClient = useQueryClient()
  const [deletingEventId, setDeletingEventId] = useState(null)
  // Query for fetching events
  const {
    data: eventDetails,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery('events', fetchEvents, {
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
    enabled: false, // Disable auto-fetching
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  // Mutation for deleting an event
  const deleteMutation = useMutation(deleteEvent, {
    onMutate: (eventId) => {
      setDeletingEventId(eventId)
    },
    onSuccess: (deletedEventId) => {
      queryClient.setQueryData('events', (oldData) =>
        oldData.filter((event) => event._id !== deletedEventId)
      )
      setDeleteConfirmation({ show: false, eventId: null })
      setDeletingEventId(null)
    },
    onError: () => {
      setDeletingEventId(null)
    },
  })

  const showDeleteConfirmation = (eventId) => {
    setDeleteConfirmation({ show: true, eventId })
  }

  const hideDeleteConfirmation = () => {
    setDeleteConfirmation({ show: false, eventId: null })
  }

  const handleDeleteEvent = () => {
    if (deleteConfirmation.eventId) {
      deleteMutation.mutate(deleteConfirmation.eventId)
    }
  }

  const toggleEventDetails = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId)
  }

  const LoadingSpinner = () => (
    <div className='flex items-center justify-center h-64'>
      <div className='relative w-24 h-24'>
        <div className='absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full animate-pulse'></div>
        <div className='absolute top-0 left-0 w-full h-full border-t-8 border-blue-500 rounded-full animate-spin'></div>
        <CalendarIcon
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500'
          size={32}
        />
      </div>
      <p className='ml-4 text-lg font-semibold text-blue-600'>
        Loading Events...
      </p>
    </div>
  )

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50'>
        <div className='container mx-auto px-4 py-8'>
          <h1 className='text-3xl font-bold mb-6 text-blue-800 flex items-center'>
            <Calendar className='mr-2' /> Events Management
          </h1>

          {isError ? (
            <div className='text-center text-red-600'>
              <h2 className='text-2xl font-bold mb-2'>Error loading events</h2>
              <p>{error.message}</p>
              <button
                onClick={() => queryClient.invalidateQueries('events')}
                className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
              >
                Retry
              </button>
            </div>
          ) : isLoading || isFetching ? (
            <LoadingSpinner />
          ) : (
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
                    {eventDetails && eventDetails.length > 0 ? (
                      eventDetails.map((event) => (
                        <React.Fragment key={event._id}>
                          <tr className='border-b hover:bg-blue-50 transition-colors duration-200'>
                            <td className='px-6 py-4 font-medium'>
                              {event.eventType}
                            </td>
                            <td className='px-6 py-4'>
                              <div className='flex items-center'>
                                <Calendar
                                  className='mr-2 text-blue-600'
                                  size={18}
                                />
                                {new Date(event.start).toLocaleDateString()} -{' '}
                                {new Date(event.end).toLocaleDateString()}
                              </div>
                            </td>
                            <td className='px-6 py-4'>
                              <div className='flex items-center'>
                                <MapPin
                                  className='mr-2 text-blue-600'
                                  size={18}
                                />
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
                                  {expandedEventId === event._id
                                    ? 'Hide'
                                    : 'Details'}
                                </span>
                              </button>
                              {deletingEventId === event._id ? (
                                <div className='flex items-center text-red-600'>
                                  <Loader
                                    className='animate-spin mr-2'
                                    size={18}
                                  />
                                  <span>Deleting...</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    showDeleteConfirmation(event._id)
                                  }
                                  className='text-red-600 hover:text-red-800 flex items-center'
                                >
                                  <Trash2 size={18} />
                                  <span className='ml-1'>Delete</span>
                                </button>
                              )}
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
                                      <strong>Province:</strong>{' '}
                                      {event.province}
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
                                        <strong>Reference:</strong>{' '}
                                        {event.reference}
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
                                          {event.selectedMaterials.map(
                                            (material) => (
                                              <li key={material.materialId}>
                                                {material.name} - Quantity:{' '}
                                                {material.quantity}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                    {event.merchandising && (
                                      <div>
                                        <h4 className='font-semibold text-lg mb-2 text-blue-800 flex items-center'>
                                          <ShoppingBag
                                            className='mr-2'
                                            size={18}
                                          />
                                          Merchandising
                                        </h4>
                                        <ul className='list-disc list-inside pl-5'>
                                          {event.selectedMerchandising.map(
                                            (item) => (
                                              <li key={item.merchandisingId}>
                                                {item.name} - Quantity:{' '}
                                                {item.quantity}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='4' className='px-6 py-4 text-center'>
                          No events found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-xl'>
            <h2 className='text-xl font-bold mb-4'>Confirm Deletion</h2>
            <p className='mb-6'>Are you sure you want to delete this event?</p>
            <div className='flex justify-end'>
              <button
                onClick={hideDeleteConfirmation}
                className='px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2 hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default EventsManagementPage
