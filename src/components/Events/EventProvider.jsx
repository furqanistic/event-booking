import { createContext, useContext, useState } from 'react'

const EventContext = createContext()

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [draftEvent, setDraftEvent] = useState(null)

  const addEvent = (event) => {
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        id: Date.now(),
        ...event,
      },
    ])
    setDraftEvent(null) // Clear the draft event after adding
  }

  const updateDraftEvent = (eventData) => {
    setDraftEvent(eventData)
  }

  return (
    <EventContext.Provider
      value={{ events, addEvent, draftEvent, updateDraftEvent }}
    >
      {children}
    </EventContext.Provider>
  )
}

export const useEventContext = () => useContext(EventContext)

export default EventProvider
