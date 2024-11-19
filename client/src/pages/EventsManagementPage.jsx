import { Calendar } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query' // Keep React Query only for GET request
import { useSelector } from 'react-redux'
import EventList from '../components/Event-Management/EventList'
import { axiosInstance } from '../config'
import Layout from './Layout'

const fetchEvents = async () => {
  const response = await axiosInstance.get('/events')
  return response.data.data.events
}

const EventsManagementPage = () => {
  const [expandedEventId, setExpandedEventId] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    eventId: null,
  })
  const [deletingEventId, setDeletingEventId] = useState(null)
  const [extendingEventId, setExtendingEventId] = useState(null)
  const { currentUser } = useSelector((state) => state.user)

  // Keep React Query for GET request
  const {
    data: eventDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery('events', fetchEvents, {
    staleTime: 60000,
    refetchOnWindowFocus: false,
    enabled: false,
  })

  useEffect(() => {
    refetch()
  }, [refetch])
  const handleDeleteClick = (eventId) => {
    setDeleteConfirmation({ show: true, eventId })
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation.eventId) {
      setDeletingEventId(deleteConfirmation.eventId)
      try {
        await axiosInstance.delete(`/events/${deleteConfirmation.eventId}`)
        // Update local state after successful deletion
        eventDetails.filter((event) => event._id !== deleteConfirmation.eventId)
        // Manually update the events data
        refetch()
        setDeleteConfirmation({ show: false, eventId: null })
      } catch (error) {
        console.error('Failed to delete event:', error)
      } finally {
        setDeletingEventId(null)
      }
    }
  }

  const handleExtendDate = async (eventId, data) => {
    console.log('Date in Management Page:', data.date) // Debug log
    setExtendingEventId(eventId)
    try {
      const response = await axiosInstance.put(`/events/${eventId}`, {
        extendDate: data.daysExtended,
        extensionNotes: {
          date: data.date, // Use the exact selected date
          note: data.note,
          createdBy: currentUser.data.user._id,
        },
      })
      console.log('Response:', response) // Debug log
      refetch()
    } catch (error) {
      console.error('Failed to extend event date:', error)
    } finally {
      setExtendingEventId(null)
    }
  }

  const toggleEventDetails = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId)
  }

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8'>
            <h1 className='text-2xl font-semibold text-gray-900 flex items-center space-x-2'>
              <Calendar className='text-indigo-600' />
              <span>Events Management</span>
            </h1>
            <p className='mt-1 text-gray-500'>
              Manage and track all your scheduled events
            </p>
          </div>

          {isError ? (
            <div className='text-center bg-white rounded-lg shadow-sm border border-red-100 p-8'>
              <h2 className='text-xl font-semibold text-red-600 mb-2'>
                Error loading events
              </h2>
              <p className='text-gray-600 mb-4'>{error.message}</p>
              <button
                onClick={refetch}
                className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200'
              >
                Retry
              </button>
            </div>
          ) : (
            <EventList
              events={eventDetails}
              isLoading={isLoading}
              expandedEventId={expandedEventId}
              deletingEventId={deletingEventId}
              extendingEventId={extendingEventId}
              onToggleDetails={toggleEventDetails}
              onDeleteClick={handleDeleteClick}
              onExtendDate={handleExtendDate}
            />
          )}
        </div>
      </div>

      {deleteConfirmation.show && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Confirm Deletion
            </h2>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={() =>
                  setDeleteConfirmation({ show: false, eventId: null })
                }
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200'
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200'
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default EventsManagementPage
