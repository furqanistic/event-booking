import { createContext, useContext, useState } from 'react'

const EventContext = createContext()

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [draftEvent, setDraftEvent] = useState(null)
  const [materialAvailability, setMaterialAvailability] = useState({})

  const addEvent = (event) => {
    setEvents((prevEvents) => [...prevEvents, { id: Date.now(), ...event }])
    updateMaterialAvailability(event)
    setDraftEvent(null)
  }

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
        addEvent,
        draftEvent,
        updateDraftEvent,
        checkMaterialAvailability,
        getAvailableQuantity,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export const useEventContext = () => useContext(EventContext)
export default EventProvider
