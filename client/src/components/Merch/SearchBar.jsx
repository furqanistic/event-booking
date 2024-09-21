import React from 'react'

const SearchBar = ({ value, onChange }) => {
  return (
    <div className='mb-4'>
      <input
        type='text'
        placeholder='¿Qué deseas buscar?'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full p-2 border border-gray-300 rounded'
      />
    </div>
  )
}

export default SearchBar
