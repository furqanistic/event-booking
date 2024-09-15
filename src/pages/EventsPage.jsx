import Calendar from '../components/Events/Calendar'
import EventForm from '../components/Events/EventForm'
import EventProvider from '../components/Events/EventProvider'
import Layout from './Layout'

const EventsPage = () => {
  return (
    <Layout>
      <EventProvider>
        <div className='min-h-screen flex flex-col'>
          <div className='flex-grow overflow-hidden'>
            <div className='h-full'>
              <div className='grid grid-cols-1 lg:grid-cols-[35%_65%] h-full'>
                {/* Left column for event details */}
                <div className='h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200'>
                  <EventForm />
                </div>
                {/* Right column for calendar */}
                <div className='h-full overflow-hidden'>
                  <Calendar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </EventProvider>
    </Layout>
  )
}

export default EventsPage
