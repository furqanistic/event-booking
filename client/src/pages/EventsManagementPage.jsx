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
import Layout from './Layout'

// Fetch events

// Delete event
const deleteEvent = async (eventId) => {
  await axiosInstance.delete(`/events/${eventId}`)
}

const EventsManagementPage = () => {
  const [expandedEventId, setExpandedEventId] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    eventId: null,
  })
  const queryClient = useQueryClient()

  // Query for fetching events
  const {
    data: eventDetails,
    isLoading,
    error,
  } = useQuery('materials', async () => {
    const response = await axiosInstance.get('/events')
    return response.data.data.events
  })

  // Mutation for deleting an event
  const deleteMutation = useMutation(deleteEvent, {
    onSuccess: () => {
      // Invalidate and refetch the events query
      queryClient.invalidateQueries('eventDetails')
      setDeleteConfirmation({ show: false, eventId: null })
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

  if (isLoading)
    return <div className='text-center py-10'>Loading events...</div>
  if (error)
    return (
      <div className='text-center py-10 text-red-600'>
        Error loading events: {error.message}
      </div>
    )

  return (
    <Layout>
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
                  {eventDetails.map((event) => (
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
                              {expandedEventId === event._id
                                ? 'Hide'
                                : 'Details'}
                            </span>
                          </button>
                          <button
                            onClick={() => showDeleteConfirmation(event._id)}
                            className='text-red-600 hover:text-red-800 flex items-center'
                          >
                            <Trash2 size={18} />
                            <span className='ml-1'>Delete</span>
                          </button>
                        </td>
                      </tr>
                      {expandedEventId === event._id && (
                        <tr>
                          <td colSpan='4' className='px-6 py-4 bg-blue-50'>
                            {/* ... (existing expanded event details) ... */}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
