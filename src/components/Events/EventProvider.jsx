import React, { createContext, useContext, useState } from 'react'

const EventContext = createContext()

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])

  const addEvent = (event) => {
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        id: Date.now(),
        ...event,
      },
    ])
  }

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEventContext = () => useContext(EventContext)

export default EventProvider
