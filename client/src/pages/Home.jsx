import { CalendarIcon, Star, Trophy } from 'lucide-react'
import EventsLineChart from '../components/Home/EventsLineChart'
import GaugeChart from '../components/Home/GaugeChart'
import MonthlyCalendar from '../components/Home/MonthlyCalender'
import NewsCards from '../components/Home/NewsCard'
import StatisticBoxes from '../components/Home/StatisticBoxes'
import Layout from './Layout'

const Home = () => {
  return (
    <Layout>
      <div className='p-6 space-y-6'>
        <StatisticBoxes />

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3'>
            <EventsLineChart />
          </div>
          <div>
            <MonthlyCalendar />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3'>
            <NewsCards />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
