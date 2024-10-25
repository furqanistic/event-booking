import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Clock, Search, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Layout from './Layout'

const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'blog', label: 'Blog' },
  { id: 'campanas', label: 'Campañas' },
  { id: 'sociales', label: 'Sociales' },
]

const mockNews = [
  {
    id: 1,
    title: 'Straumann Group Unveils Revolutionary Dental Implant Technology',
    category: 'blog',
    image: 'https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg',
    date: '2024-03-20',
    readTime: '5 min',
    description:
      'Introducing our latest innovation in dental implant technology - the TLX Implant System. This groundbreaking solution offers immediate stability and optimal tissue preservation, setting new standards in immediate implant protocols.',
    author: 'Dr. Maria Rodriguez',
    featured: true,
  },
  {
    id: 2,
    title: 'Community Outreach: Free Dental Check-up Campaign',
    category: 'campanas',
    image: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg',
    date: '2024-03-18',
    readTime: '3 min',
    description:
      'Straumann Group partners with local clinics to provide free dental check-ups and consultations. The initiative aims to improve oral health awareness and accessibility to quality dental care.',
    author: 'Carlos Mendoza',
  },
  {
    id: 3,
    title: 'Annual Dental Excellence Awards 2024',
    category: 'sociales',
    image: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg',
    date: '2024-03-15',
    readTime: '4 min',
    description:
      'Celebrating excellence in dentistry at our annual awards ceremony. Recognizing outstanding achievements in dental practices and innovative solutions that have transformed patient care.',
    author: 'Ana Silva',
  },
  {
    id: 4,
    title: 'New Training Center Opens in Lima',
    category: 'blog',
    image: 'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg',
    date: '2024-03-14',
    readTime: '6 min',
    description:
      'Expanding our commitment to dental education, Straumann Group opens a state-of-the-art training facility in Lima. The center will offer comprehensive courses and hands-on training for dental professionals.',
    author: 'Dr. Juan Carlos Pérez',
  },
  {
    id: 5,
    title: 'Sustainable Dentistry Initiative Launch',
    category: 'campanas',
    image: 'https://images.pexels.com/photos/305565/pexels-photo-305565.jpeg',
    date: '2024-03-12',
    readTime: '4 min',
    description:
      'Launching our new environmental sustainability program focused on reducing the environmental impact of dental practices through eco-friendly products and waste reduction strategies.',
    author: 'Laura González',
  },
  {
    id: 6,
    title: 'Digital Dentistry Symposium Success',
    category: 'sociales',
    image:
      'https://media.3shape.com.imgeng.in/-/media/corporate/seo-articles/digital-dentistry/digital-dentistry-benefits.jpgh?h=611&w=1280&v=bdc9e333-cce6-4f71-869e-788f739277a4&hash=430F24D43BD3780A2764431857789E93',
    date: '2024-03-10',
    readTime: '5 min',
    description:
      'Over 500 dental professionals gathered for our Digital Dentistry Symposium, exploring the latest advancements in digital workflows and CAD/CAM technologies.',
    author: 'Dr. Miguel Ángel Torres',
  },
  {
    id: 7,
    title: 'Clear Aligner Innovation: ClearCorrect Updates',
    category: 'blog',
    image: 'https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg',
    date: '2024-03-08',
    readTime: '4 min',
    description:
      'Introducing new features in our ClearCorrect aligner system, offering enhanced treatment planning capabilities and improved patient comfort.',
    author: 'Dr. Patricia Lima',
  },
  {
    id: 8,
    title: 'Dental Health Education Program',
    category: 'campanas',
    image: 'https://images.pexels.com/photos/4269692/pexels-photo-4269692.jpeg',
    date: '2024-03-06',
    readTime: '3 min',
    description:
      'Launching a nationwide education program in schools to promote oral health awareness among children and teenagers. The initiative includes interactive workshops and free dental kits.',
    author: 'Ricardo Vargas',
  },
  {
    id: 9,
    title: 'Straumann Group Charity Gala',
    category: 'sociales',
    image: 'https://images.pexels.com/photos/7089629/pexels-photo-7089629.jpeg',
    date: '2024-03-04',
    readTime: '5 min',
    description:
      'Annual charity event raises funds for providing dental care to underserved communities. The gala brought together industry leaders and healthcare professionals for a noble cause.',
    author: 'Isabella Martínez',
  },
  {
    id: 10,
    title: 'BLX Implant System: Clinical Success Stories',
    category: 'blog',
    image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg',
    date: '2024-03-02',
    readTime: '6 min',
    description:
      "Highlighting remarkable patient cases and clinical outcomes achieved with our BLX Implant System. Featured cases demonstrate the system's versatility and reliability.",
    author: 'Dr. Fernando Santos',
    featured: true,
  },
  {
    id: 11,
    title: 'Dental Professional Development Workshop',
    category: 'campanas',
    image: 'https://images.pexels.com/photos/3845749/pexels-photo-3845749.jpeg',
    date: '2024-02-28',
    readTime: '4 min',
    description:
      'Free workshop series for dental professionals focusing on practice management, patient communication, and the latest clinical techniques.',
    author: 'Carmen Ortiz',
  },
  {
    id: 12,
    title: 'International Dental Conference 2024',
    category: 'sociales',
    image: 'https://images.pexels.com/photos/3952240/pexels-photo-3952240.jpeg',
    date: '2024-02-26',
    readTime: '5 min',
    description:
      'Straumann Group hosts international conference bringing together experts from over 30 countries to discuss the future of dentistry and showcase innovative solutions.',
    author: 'Dr. Alberto Ramírez',
  },
]

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [news, setNews] = useState(mockNews)
  const [filteredNews, setFilteredNews] = useState(mockNews)

  useEffect(() => {
    const filtered = news.filter((item) => {
      const matchesCategory =
        selectedCategory === 'todos' || item.category === selectedCategory
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    setFilteredNews(filtered)
  }, [selectedCategory, searchTerm, news])

  const NewsCard = ({ item }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`group relative ${
        item.featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <div className='relative h-full overflow-hidden bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-lg'>
        <div className='aspect-[16/10] overflow-hidden'>
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src={item.image}
            alt={item.title}
            className='w-full h-full object-cover'
          />
          {item.featured && (
            <div className='absolute top-4 right-4'>
              <span className='px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full'>
                Featured
              </span>
            </div>
          )}
        </div>

        <div className='p-6'>
          <motion.div
            initial={false}
            className='flex items-center justify-between mb-4'
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              className='px-3 py-1 text-sm font-medium bg-gray-100 rounded-full'
            >
              {categories.find((cat) => cat.id === item.category)?.label}
            </motion.span>
            <div className='flex items-center space-x-4 text-sm text-gray-500'>
              <span className='flex items-center'>
                <Clock className='w-4 h-4 mr-1' />
                {item.readTime}
              </span>
              <span className='flex items-center'>
                <Calendar className='w-4 h-4 mr-1' />
                {item.date}
              </span>
            </div>
          </motion.div>

          <h2
            className={`font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors
            ${item.featured ? 'text-2xl' : 'text-xl'}`}
          >
            {item.title}
          </h2>

          <p className='text-gray-600 mb-4 line-clamp-2'>{item.description}</p>

          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>By {item.author}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className='flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors'
            >
              Read More
              <ArrowUpRight className='w-4 h-4 ml-1' />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <Layout>
      <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className='bg-white sticky top-0 z-30 border-b shadow-sm'
        >
          <div className='max-w-7xl mx-auto'>
            <div className='py-6 px-4 sm:px-6 lg:px-8'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0'>
                <motion.h1
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className='text-3xl font-bold text-gray-900'
                >
                  Latest News
                </motion.h1>

                <div className='w-full md:w-auto flex items-center space-x-4'>
                  <motion.div
                    initial={{ x: 20 }}
                    animate={{ x: 0 }}
                    className='relative flex-grow md:flex-grow-0'
                  >
                    <input
                      type='text'
                      placeholder='Search news...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-full md:w-80 pl-10 pr-4 py-2 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-shadow hover:shadow-md'
                    />
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <AnimatePresence>
                      {searchTerm && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setSearchTerm('')}
                          className='absolute right-3 top-1/2 -translate-y-1/2'
                        >
                          <X className='w-5 h-5 text-gray-400 hover:text-gray-600' />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className='px-4 sm:px-6 lg:px-8 pb-4 flex items-center space-x-2 overflow-x-auto scrollbar-hide'
            >
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all
                  ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <AnimatePresence mode='wait'>
            {filteredNews.length === 0 ? (
              <motion.div
                key='empty'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='text-center py-20'
              >
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No articles found
                </h3>
                <p className='text-gray-500'>
                  Try adjusting your search or filters
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              >
                <AnimatePresence>
                  {filteredNews.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  )
}

export default News
