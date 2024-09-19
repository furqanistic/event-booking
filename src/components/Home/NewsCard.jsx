import { ArrowRight } from 'lucide-react'

const NewsCard = ({ image, title, excerpt, link }) => (
  <div className='bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg'>
    <img src={image} alt={title} className='w-full h-48 object-cover' />
    <div className='p-6'>
      <h3 className='text-xl font-semibold mb-3 text-gray-800 line-clamp-2'>
        {title}
      </h3>
      <p className='text-gray-600 mb-4 line-clamp-3'>{excerpt}</p>
      <a
        href={link}
        className='inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300'
      >
        Leer más
        <ArrowRight size={16} className='ml-2' />
      </a>
    </div>
  </div>
)

const NewsCards = () => {
  const news = [
    {
      image:
        'https://static.vecteezy.com/system/resources/previews/002/909/185/original/colorful-design-geometric-background-for-landing-pages-banner-placeholder-and-print-vector.jpg',
      title: 'Innovaciones en tecnología empresarial',
      excerpt:
        'Descubra las últimas tendencias en tecnología que están transformando el panorama empresarial y mejorando la eficiencia operativa.',
      link: '#',
    },
    {
      image:
        'https://static.vecteezy.com/system/resources/previews/002/909/185/original/colorful-design-geometric-background-for-landing-pages-banner-placeholder-and-print-vector.jpg',
      title: 'Estrategias de crecimiento sostenible',
      excerpt:
        'Explore enfoques probados para lograr un crecimiento empresarial sostenible en un mercado cada vez más competitivo.',
      link: '#',
    },
    {
      image:
        'https://static.vecteezy.com/system/resources/previews/002/909/185/original/colorful-design-geometric-background-for-landing-pages-banner-placeholder-and-print-vector.jpg',
      title: 'Liderazgo en la era digital',
      excerpt:
        'Aprenda cómo los líderes efectivos están adaptando sus estilos de gestión para prosperar en el entorno digital actual.',
      link: '#',
    },
  ]

  return (
    <div className='bg-white p-8 rounded-xl shadow-lg'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        Novedades Corporativas
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {news.map((item, index) => (
          <NewsCard key={index} {...item} />
        ))}
      </div>
    </div>
  )
}

export default NewsCards
