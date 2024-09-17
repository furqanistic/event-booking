import React from 'react'

const Pagination = ({
  productsPerPage,
  totalProducts,
  paginate,
  currentPage,
}) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className='flex justify-center mt-8'>
      <ul className='flex'>
        {pageNumbers.map((number) => (
          <li key={number} className='mx-1'>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 border rounded ${
                currentPage === number
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 hover:bg-blue-100'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Pagination
