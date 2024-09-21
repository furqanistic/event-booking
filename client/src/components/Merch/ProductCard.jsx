import { ShoppingCart } from 'lucide-react'
import React from 'react'

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full'>
      <div className='relative flex-shrink-0'>
        <img
          src={product.image}
          alt={product.name}
          className='w-full h-48 object-cover transition-transform duration-300 hover:scale-105'
        />
      </div>
      <div className='p-4 flex flex-col flex-grow'>
        <h3 className='text-md font-semibold text-gray-800 mb-4 line-clamp-2 flex-grow'>
          {product.name}
        </h3>
        <button
          className='w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          onClick={() => addToCart(product)}
        >
          <ShoppingCart size={18} className='mr-2' />
          <span className='text-sm'>Agregar al carrito</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
