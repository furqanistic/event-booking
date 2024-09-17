import React from 'react'

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className='border border-gray-200 rounded p-4 flex flex-col'>
      <img
        src={product.image}
        alt={product.name}
        className='w-full h-40 object-cover mb-2'
      />
      <h3 className='text-lg font-semibold mb-2'>{product.name}</h3>
      <button
        className='mt-auto bg-blue-600 text-white px-4 py-2 rounded'
        onClick={() => addToCart(product)}
      >
        Agregar al carrito
      </button>
    </div>
  )
}

export default ProductCard
