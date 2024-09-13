import React from 'react'
import ProductCard from './ProductCard'

const products = [
  { id: 1, name: 'Banner', image: '/path/to/banner.jpg' },
  { id: 2, name: 'Block', image: '/path/to/block.jpg' },
  { id: 3, name: 'Cuaderno Premium', image: '/path/to/cuaderno.jpg' },
  { id: 4, name: 'Gorros Quirúrgicos', image: '/path/to/gorros.jpg' },
  { id: 5, name: 'Lapiceros', image: '/path/to/lapiceros.jpg' },
  { id: 6, name: 'Who is Who BLT', image: '/path/to/who-is-who.jpg' },
  { id: 7, name: 'WIW Cirugía guiada', image: '/path/to/cirugia-guiada.jpg' },
  { id: 8, name: 'Banner 1x2 Modelo 1', image: '/path/to/banner-1x2.jpg' },
]

const ProductGrid = ({ searchQuery }) => {
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
