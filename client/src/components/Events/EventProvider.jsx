import { createContext, useCallback, useContext, useState } from 'react'
import { axiosInstance } from '../../config' // Make sure this path is correct

const EventContext = createContext()

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [draftEvent, setDraftEvent] = useState(null)
  const [materialAvailability, setMaterialAvailability] = useState({})

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/events')
      setEvents(response.data.data.events)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }, [])

  const refreshEvents = useCallback(() => {
    fetchEvents()
  }, [fetchEvents])

  const updateDraftEvent = (eventData) => {
    setDraftEvent(eventData)
  }

  const updateMaterialAvailability = (event) => {
    const { start, end, details } = event
    const startDate = new Date(start).toDateString()
    const endDate = new Date(end).toDateString()
    setMaterialAvailability((prevAvailability) => {
      const newAvailability = { ...prevAvailability }
      let currentDate = new Date(start)
      while (currentDate <= new Date(end)) {
        const dateString = currentDate.toDateString()
        if (!newAvailability[dateString]) {
          newAvailability[dateString] = {}
        }
        details.selectedMaterials.forEach((material) => {
          if (!newAvailability[dateString][material.id]) {
            newAvailability[dateString][material.id] = material.available
          }
          newAvailability[dateString][material.id] -= material.quantity
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }
      return newAvailability
    })
  }

  const checkMaterialAvailability = (date, materials) => {
    const dateString = new Date(date).toDateString()
    if (!materialAvailability[dateString]) return true
    return materials.every(
      (material) =>
        !materialAvailability[dateString][material.id] ||
        materialAvailability[dateString][material.id] >= material.quantity
    )
  }

  const getAvailableQuantity = (materialId, date) => {
    const dateString = new Date(date).toDateString()
    if (
      !materialAvailability[dateString] ||
      !materialAvailability[dateString][materialId]
    ) {
      return null // Return null if no information is available
    }
    return materialAvailability[dateString][materialId]
  }

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        draftEvent,
        updateDraftEvent,
        checkMaterialAvailability,
        getAvailableQuantity,
        refreshEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export const useEventContext = () => useContext(EventContext)
export default EventProvider
