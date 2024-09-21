import EventsLineChart from '../components/Home/EventsLineChart'
import GaugeChart from '../components/Home/GaugeChart'
import MonthlyCalendar from '../components/Home/MonthlyCalender'
import NewsCards from '../components/Home/NewsCard'
import StatisticBoxes from '../components/Home/StatisticBoxes'
import Layout from './Layout'

const Home = () => {
  return (
    <Layout>
      <div className='p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6'>
          <div className='lg:col-span-3'>
            <StatisticBoxes />
          </div>
          <div>
            <MonthlyCalendar />
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3'>
            <EventsLineChart />
            <NewsCards />
          </div>
          <div>
            <GaugeChart score={4.18} maxScore={5} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
