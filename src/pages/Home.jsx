import GaugeChart from '../components/Home/GaugeChart'
import MonthlyCalendar from '../components/Home/MonthlyCalender'
import NewsCards from '../components/Home/NewsCard'
import StatisticCards from '../components/Home/StatisticCards'
import Layout from './Layout'

const Home = () => {
  return (
    <Layout>
      <div className='p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6'>
          <div className='lg:col-span-3'>
            <StatisticCards />
          </div>
          <div>
            <MonthlyCalendar />
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3'>
            <NewsCards />
          </div>
          <div>
            <GaugeChart percentage={75} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
