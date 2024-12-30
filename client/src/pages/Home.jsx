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
      <div className='p-6 flex flex-col gap-4'>
        <StatisticBoxes />

        {/* Events and Calendar Section with News */}
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Left Side: Events + News */}
          <div className='flex-grow lg:w-3/4 flex flex-col gap-4'>
            <EventsLineChart />
            <NewsCards />
          </div>

          {/* Right Side: Calendar + Reservations */}
          <div className='w-full lg:w-1/4 flex flex-col gap-4'>
            <MonthlyCalendar />
            {/* Your Today's Room Reservations component goes here */}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
