import React, { useEffect, useState } from 'react'
import Pagination from './Pagination'
import ProductCard from './ProductCard'

const products = [
  {
    id: 1,
    name: 'Banner',
    image:
      'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png',
  },
  {
    id: 2,
    name: 'Block',
    image:
      'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png',
  },
  {
    id: 3,
    name: 'Cuaderno Premium',
    image:
      'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png',
  },
  {
    id: 4,
    name: 'Gorros Quirúrgicos',
    image:
      'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png',
  },
  {
    id: 5,
    name: 'Lapiceros',
    image:
      'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png',
  },
  {
    id: 6,
    name: 'Who is Who BLT',
    image:
      'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png',
  },
  {
    id: 7,
    name: 'WIW Cirugía guiada',
    image:
      'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png',
  },
  {
    id: 8,
    name: 'Banner 1x2 Modelo 1',
    image:
      'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png',
  },
  {
    id: 9,
    name: 'Bolígrafos Personalizados',
    image:
      'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png',
  },
  {
    id: 10,
    name: 'Cuaderno Básico',
    image:
      'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png',
  },
  {
    id: 11,
    name: 'Carpetas Corporativas',
    image:
      'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png',
  },
]

const ProductGrid = ({ searchQuery, addToCart }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredProducts, setFilteredProducts] = useState([])
  const productsPerPage = 8

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when search query changes
  }, [searchQuery])

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
      <Pagination
        productsPerPage={productsPerPage}
        totalProducts={filteredProducts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
  )
}

export default ProductGrid
