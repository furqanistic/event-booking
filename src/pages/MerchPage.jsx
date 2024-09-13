import { useState } from 'react'
import Pagination from '../components/Merch/Pagination'
import ProductGrid from '../components/Merch/ProductGrid'
import SearchBar from '../components/Merch/SearchBar'
import Layout from './Layout'

const MerchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Carrito')
  const [formData, setFormData] = useState({
    address: '',
    reference: '',
    department: 'Amazonas',
    province: 'Chachapoyas',
    district: 'Chachapoyas',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const renderDropdown = (name, value, options) => (
    <div className='relative'>
      <select
        name={name}
        value={value}
        onChange={handleInputChange}
        className='w-full border border-gray-300 rounded-md p-2 appearance-none'
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
        <svg
          className='fill-current h-4 w-4'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
        >
          <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
        </svg>
      </div>
    </div>
  )

  const departmentOptions = [
    { value: 'Amazonas', label: 'Amazonas' },
    // Add other departments here
  ]

  const provinceOptions = [
    { value: 'Chachapoyas', label: 'Chachapoyas' },
    // Add other provinces here
  ]

  const districtOptions = [
    { value: 'Chachapoyas', label: 'Chachapoyas' },
    // Add other districts here
  ]

  return (
    <Layout>
      <div className='min-h-screen flex flex-col md:flex-row'>
        {/* Left column - Form */}
        <div className='w-full md:w-1/3 p-4 border-b md:border-b-0 md:border-r border-gray-200'>
          <div className='flex justify-between mb-6'>
            <button
              className={`text-xl font-normal py-2 px-4 ${
                activeTab === 'Carrito'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('Carrito')}
            >
              Carrito
            </button>
            <button
              className={`text-xl font-normal py-2 px-4 ${
                activeTab === 'Registra tu pedido'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('Registra tu pedido')}
            >
              Registra tu pedido
            </button>
          </div>
          <form className='space-y-4'>
            <div className='space-y-4 border border-gray-200 rounded-md p-4'>
              <h3 className='font-medium text-gray-700'>Dirección</h3>

              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Dirección:
                </label>
                <input
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Referencia
                </label>
                <input
                  type='text'
                  name='reference'
                  value={formData.reference}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Departamento
                </label>
                {renderDropdown(
                  'department',
                  formData.department,
                  departmentOptions
                )}
              </div>

              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Provincia
                </label>
                {renderDropdown('province', formData.province, provinceOptions)}
              </div>

              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Distrito
                </label>
                {renderDropdown('district', formData.district, districtOptions)}
              </div>
            </div>
          </form>
        </div>

        {/* Right column - Product Listing */}
        <div className='w-2/3 p-4'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex-grow mr-4'>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <button className='bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap'>
              Ver solicitud{' '}
              <span className='ml-1 bg-white text-blue-600 rounded-full px-2'>
                0
              </span>
            </button>
          </div>
          <ProductGrid searchQuery={searchQuery} />
          <Pagination />
        </div>
      </div>
    </Layout>
  )
}

export default MerchPage
