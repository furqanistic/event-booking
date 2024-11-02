import {
  Calendar,
  CalendarIcon,
  MonitorPlay,
  Package,
  Users,
} from 'lucide-react'
import { useQuery } from 'react-query'
import { axiosInstance } from '../../config'

const StatBox = ({ number, text, icon: Icon, color, trend }) => (
  <div className={`p-6 rounded-xl shadow-md ${color} text-white`}>
    <div className='flex justify-between items-start'>
      <div>
        <p className='text-3xl font-bold mb-1'>{number}</p>
        <p className='text-sm text-white/80'>{text}</p>
        {trend && (
          <div className='mt-2 text-sm text-white/80'>
            <span className={trend > 0 ? 'text-green-300' : 'text-red-300'}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            {' vs last month'}
          </div>
        )}
      </div>
      <div className='p-2 bg-white/10 rounded-lg'>
        <Icon size={24} className='text-white' />
      </div>
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

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatBox
            number={fetchedTotalEventsData.data?.totalEvents || 0}
            text='Total Events'
            icon={Calendar}
            color='bg-blue-600'
            trend={12.5}
          />
          <StatBox
            number='1'
            text='Active Users'
            icon={Users}
            color='bg-purple-600'
            trend={8.2}
          />
          <StatBox
            number='1'
            text='Room Bookings'
            icon={MonitorPlay}
            color='bg-indigo-600'
            trend={-2.4}
          />
          <StatBox
            number='1'
            text='Merch Requests'
            icon={Package}
            color='bg-pink-600'
            trend={15.8}
          />
        </div>
      )}
    </>
  )
}

export default StatisticBoxes
