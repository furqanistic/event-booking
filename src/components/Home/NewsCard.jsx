const NewsCard = ({ image, title, excerpt, link }) => (
  <div className='bg-white rounded-lg shadow-md overflow-hidden'>
    <img src={image} alt={title} className='w-full h-48 object-cover' />
    <div className='p-4'>
      <h3 className='text-xl font-semibold mb-2'>{title}</h3>
      <p className='text-gray-600 mb-4'>{excerpt}</p>
      <a href={link} className='text-blue-500 hover:underline'>
        más
      </a>
    </div>
  </div>
)

const NewsCards = () => {
  const news = [
    {
      image: '/api/placeholder/800/600',
      title: 'Tempore consequatur qui qui dolorem',
      excerpt: 'Dolores...',
      link: '#',
    },
    {
      image: '/api/placeholder/800/600',
      title: 'Atque in ea sint',
      excerpt: 'Expedita...',
      link: '#',
    },
    {
      image: '/api/placeholder/800/600',
      title: 'Dolorem maiores at debitis',
      excerpt:
        'Repudiandae quibusdam odio nulla. Omnis dolor recusandae aut aperiam Consequatur mollitia dolores...',
      link: '#',
    },
  ]

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Novedades</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {news.map((item, index) => (
          <NewsCard key={index} {...item} />
        ))}
      </div>
    </div>
  )
}

export default NewsCards
