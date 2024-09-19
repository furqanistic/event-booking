import { Calendar, MonitorPlay, Package } from 'lucide-react'

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

const StatisticBoxes = () => {
  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <StatBox
          number='10'
          text='Eventos registrados'
          icon={Calendar}
          color='bg-blue-700'
        />
        <StatBox
          number='19'
          text='Reservas de salas'
          icon={MonitorPlay}
          color='bg-purple-500'
        />
        <StatBox
          number='15'
          text='Solicitudes de merch'
          icon={Package}
          color='bg-indigo-900'
        />
      </div>
      <div className='flex flex-col sm:flex-row gap-4'>
        <StatBox
          number='10'
          text='Eventos registrados'
          icon={Calendar}
          color='bg-blue-700'
        />
        <StatBox
          number='19'
          text='Reservas de salas'
          icon={MonitorPlay}
          color='bg-purple-500'
        />
      </div>
    </div>
  )
}

export default StatisticBoxes
