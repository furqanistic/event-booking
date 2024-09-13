import { Calendar, Gift, MonitorPlay } from 'lucide-react'

const StatBox = ({ number, text, icon: Icon, color, wide = false }) => (
  <div
    className={`p-4 rounded-lg shadow-md ${color} text-white ${
      wide ? 'col-span-2' : ''
    }`}
  >
    <div className='flex justify-between items-center'>
      <div>
        <p className='text-3xl font-bold'>{number}</p>
        <p className='text-sm'>{text}</p>
      </div>
      <Icon size={24} />
    </div>
  </div>
)

const StatisticBoxes = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      <StatBox
        number='15'
        text='Solicitudes de merch'
        icon={Gift}
        color='bg-indigo-900'
      />
      <StatBox
        number='10'
        text='Eventos registrados'
        icon={Calendar}
        color='bg-blue-500'
      />
      <StatBox
        number='19'
        text='Reservas de salas'
        icon={MonitorPlay}
        color='bg-purple-500'
      />
      <StatBox
        number='10'
        text='Eventos registrados'
        icon={Calendar}
        color='bg-blue-500'
        wide
      />
      <StatBox
        number='19'
        text='Reservas de salas'
        icon={MonitorPlay}
        color='bg-purple-500'
        wide
      />
    </div>
  )
}

export default StatisticBoxes
