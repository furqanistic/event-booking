import { Calendar, CalendarIcon, MonitorPlay, Package } from 'lucide-react'
import { useQuery } from 'react-query'
import { axiosInstance } from '../../config'

const StatBox = ({ number, text, icon: Icon, color }) => (
  <div className={`p-6 rounded-lg shadow-md ${color} text-white flex-1`}>
    <div className='flex justify-between items-center'>
      <div>
        <p className='text-3xl font-bold'>{number}</p>
        <p className='text-sm'>{text}</p>
      </div>
      <Icon size={24} />
    </div>
  </div>
)

const LoadingSpinner = () => (
  <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
    <div className='relative w-24 h-24'>
      <div className='absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full animate-pulse'></div>
      <div className='absolute top-0 left-0 w-full h-full border-t-8 border-blue-500 rounded-full animate-spin'></div>
      <CalendarIcon
        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500'
        size={32}
      />
    </div>
    <p className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-blue-600'>
      Loading dashboard...
    </p>
  </div>
)

const StatisticBoxes = () => {
  const {
    data: fetchedTotalEventsData = [],
    isLoading,
    error,
  } = useQuery('eventsTotal', async () => {
    const response = await axiosInstance.get('/events/total')
    return response.data
  })

  console.log(fetchedTotalEventsData)
  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <>
          <div className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <StatBox
                number={fetchedTotalEventsData.data.totalEvents}
                text='Eventos registrados'
                icon={Calendar}
                color='bg-blue-700'
              />
              <StatBox
                number='0'
                text='Reservas de salas'
                icon={MonitorPlay}
                color='bg-purple-500'
              />
              <StatBox
                number='0'
                text='Solicitudes de merch'
                icon={Package}
                color='bg-indigo-900'
              />
            </div>
            <div className='flex flex-col sm:flex-row gap-4'>
              <StatBox
                number='0'
                text='Eventos registrados'
                icon={Calendar}
                color='bg-blue-700'
              />
              <StatBox
                number='0'
                text='Reservas de salas'
                icon={MonitorPlay}
                color='bg-purple-500'
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default StatisticBoxes
