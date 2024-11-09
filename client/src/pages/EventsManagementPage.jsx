import { Calendar } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import EventList from '../components/Event-Management/EventList'
import { axiosInstance } from '../config'
import Layout from './Layout'

const fetchEvents = async () => {
  const response = await axiosInstance.get('/events')
  return response.data.data.events
}

const deleteEvent = async (eventId) => {
  await axiosInstance.delete(`/events/${eventId}`)
  return eventId
}

const extendEventDate = async ({ eventId, newEndDate }) => {
  const response = await axiosInstance.patch(`/events/${eventId}`, {
    end: new Date(newEndDate).toISOString(),
  })
  return { eventId, newEndDate }
}

const EventsManagementPage = () => {
  const [expandedEventId, setExpandedEventId] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    eventId: null,
  })
  const [deletingEventId, setDeletingEventId] = useState(null)
  const [extendingEventId, setExtendingEventId] = useState(null)

  const queryClient = useQueryClient()

  const {
    data: eventDetails,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery('events', fetchEvents, {
    staleTime: 60000,
    refetchOnWindowFocus: false,
    enabled: false,
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  const deleteMutation = useMutation(deleteEvent, {
    onMutate: (eventId) => {
      setDeletingEventId(eventId)
      // Optimistic update
      const previousEvents = queryClient.getQueryData('events')
      queryClient.setQueryData('events', (old) =>
        old.filter((event) => event._id !== eventId)
      )
      return { previousEvents }
    },
    onSuccess: (deletedEventId) => {
      queryClient.setQueryData('events', (old) =>
        old.filter((event) => event._id !== deletedEventId)
      )
      setDeleteConfirmation({ show: false, eventId: null })
      setDeletingEventId(null)
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousEvents) {
        queryClient.setQueryData('events', context.previousEvents)
      }
      setDeletingEventId(null)
    },
    onSettled: () => {
      setDeletingEventId(null)
    },
  })

  const extendMutation = useMutation(extendEventDate, {
    onMutate: (variables) => {
      setExtendingEventId(variables.eventId)

      // Optimistic update
      const previousEvents = queryClient.getQueryData('events')
      queryClient.setQueryData('events', (old) =>
        old.map((event) =>
          event._id === variables.eventId
            ? { ...event, end: variables.newEndDate }
            : event
        )
      )

      return { previousEvents }
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData('events', (old) =>
        old.map((event) =>
          event._id === variables.eventId
            ? { ...event, end: variables.newEndDate }
            : event
        )
      )
      setExtendingEventId(null)
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousEvents) {
        queryClient.setQueryData('events', context.previousEvents)
      }
      setExtendingEventId(null)
      // You could add error notification here
    },
    onSettled: () => {
      setExtendingEventId(null)
    },
  })

  const handleDeleteClick = (eventId) => {
    setDeleteConfirmation({ show: true, eventId })
  }

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.eventId) {
      deleteMutation.mutate(deleteConfirmation.eventId)
    }
  }

  const handleExtendDate = (eventId, newEndDate) => {
    extendMutation.mutate({ eventId, newEndDate })
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
                onClick={() => queryClient.invalidateQueries('events')}
                className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200'
              >
                Retry
              </button>
            </div>
          ) : (
            <EventList
              events={eventDetails}
              isLoading={isLoading || isFetching}
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
