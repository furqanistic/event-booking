import React, { useEffect, useState } from 'react'
import CartSummary from '../components/Merch/CartSummary'
import Pagination from '../components/Merch/Pagination'
import ProductGrid from '../components/Merch/ProductGrid'
import SearchBar from '../components/Merch/SearchBar'
import Layout from './Layout'

const MerchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Carrito')
  const [cartItems, setCartItems] = useState([])
  const [formData, setFormData] = useState({
    address: '',
    reference: '',
    department: '',
    province: '',
    district: '',
  })

  const departmentOptions = [
    { value: '1', label: 'Amazonas' },
    { value: '2', label: 'Ancash' },
    { value: '3', label: 'Apurimac' },
    { value: '4', label: 'Arequipa' },
    { value: '5', label: 'Ayacucho' },
    { value: '6', label: 'Cajamarca' },
    { value: '7', label: 'Callao' },
    { value: '8', label: 'Cusco' },
    { value: '9', label: 'Huancavelica' },
    { value: '10', label: 'Huanuco' },
    { value: '11', label: 'Ica' },
    { value: '12', label: 'Junin' },
    { value: '13', label: 'La Libertad' },
    { value: '14', label: 'Lambayeque' },
    { value: '15', label: 'Lima' },
    { value: '16', label: 'Loreto' },
    { value: '17', label: 'Madre De Dios' },
    { value: '18', label: 'Moquegua' },
    { value: '19', label: 'Pasco' },
    { value: '20', label: 'Piura' },
    { value: '21', label: 'Puno' },
    { value: '22', label: 'San Martin' },
    { value: '23', label: 'Tacna' },
    { value: '24', label: 'Tumbes' },
    { value: '25', label: 'Ucayali' },
  ]

  const [provinceOptions, setProvinceOptions] = useState([
    { value: '1', label: 'Chachapoyas' },
    { value: '2', label: 'Bagua' },
    { value: '3', label: 'Bongara' },
    { value: '4', label: 'Condorcanqui' },
    { value: '5', label: 'Luya' },
    { value: '6', label: 'Rodriguez De Mendoza' },
    { value: '7', label: 'Utcubamba' },
  ])

  const [districtOptions, setDistrictOptions] = useState([
    { value: '1', label: 'Chachapoyas' },
    { value: '2', label: 'Asuncion' },
    { value: '3', label: 'Balsas' },
    { value: '4', label: 'Cheto' },
    { value: '5', label: 'Chiliquin' },
    { value: '6', label: 'Chuquibamba' },
    { value: '7', label: 'Granada' },
    { value: '8', label: 'Huancas' },
    { value: '9', label: 'La Jalca' },
    { value: '10', label: 'Leimebamba' },
    { value: '11', label: 'Levanto' },
    { value: '12', label: 'Magdalena' },
    { value: '13', label: 'Mariscal Castilla' },
    { value: '14', label: 'Molinopampa' },
    { value: '15', label: 'Montevideo' },
    { value: '16', label: 'Olleros' },
    { value: '17', label: 'Quinjalca' },
    { value: '18', label: 'San Francisco De Daguas' },
    { value: '19', label: 'San Isidro De Maino' },
    { value: '20', label: 'Soloco' },
    { value: '21', label: 'Sonche' },
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    if (name === 'department') {
      // Reset province and district when department changes
      setFormData((prev) => ({ ...prev, province: '', district: '' }))
      // Update province options based on selected department
      updateProvinceOptions(value)
    } else if (name === 'province') {
      // Reset district when province changes
      setFormData((prev) => ({ ...prev, district: '' }))
      // Update district options based on selected province
      updateDistrictOptions(value)
    }
  }

  const updateProvinceOptions = (departmentId) => {
    // This is a mock function. In a real scenario, you'd fetch this data from an API
    const mockProvinceOptions = [
      { value: '1', label: 'Chachapoyas' },
      { value: '2', label: 'Bagua' },
      { value: '3', label: 'Bongara' },
      { value: '4', label: 'Condorcanqui' },
      { value: '5', label: 'Luya' },
      { value: '6', label: 'Rodriguez De Mendoza' },
      { value: '7', label: 'Utcubamba' },
    ]
    setProvinceOptions(mockProvinceOptions)
  }

  const updateDistrictOptions = (provinceId) => {
    // This is a mock function. In a real scenario, you'd fetch this data from an API
    const mockDistrictOptions = [
      { value: '1', label: 'Chachapoyas' },
      { value: '2', label: 'Asuncion' },
      { value: '3', label: 'Balsas' },
      { value: '4', label: 'Cheto' },
      { value: '5', label: 'Chiliquin' },
      { value: '6', label: 'Chuquibamba' },
      { value: '7', label: 'Granada' },
      { value: '8', label: 'Huancas' },
      { value: '9', label: 'La Jalca' },
      { value: '10', label: 'Leimebamba' },
      { value: '11', label: 'Levanto' },
      { value: '12', label: 'Magdalena' },
      { value: '13', label: 'Mariscal Castilla' },
      { value: '14', label: 'Molinopampa' },
      { value: '15', label: 'Montevideo' },
      { value: '16', label: 'Olleros' },
      { value: '17', label: 'Quinjalca' },
      { value: '18', label: 'San Francisco De Daguas' },
      { value: '19', label: 'San Isidro De Maino' },
      { value: '20', label: 'Soloco' },
      { value: '21', label: 'Sonche' },
    ]
    setDistrictOptions(mockDistrictOptions)
  }

  // ... (rest of your existing code)

  const renderDropdown = (name, value, options) => (
    <div className='relative'>
      <select
        name={name}
        value={value}
        onChange={handleInputChange}
        className='w-full border border-gray-300 rounded-md p-2 appearance-none'
      >
        <option value=''>Select {name}</option>
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

  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    )
    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems]
      updatedCartItems[existingItemIndex].quantity += 1
      setCartItems(updatedCartItems)
    } else {
      setCartItems([
        ...cartItems,
        { ...item, quantity: 1, price: item.price || 0 },
      ])
    }
  }

  const removeFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index))
  }

  const updateQuantity = (index, newQuantity) => {
    const updatedCartItems = [...cartItems]
    updatedCartItems[index].quantity = newQuantity
    setCartItems(updatedCartItems)
  }

  return (
    <Layout>
      <div className='min-h-screen flex flex-col lg:flex-row'>
        {/* Left column - Cart and Form */}
        <div className='w-full lg:w-1/3 p-4 border-b lg:border-b-0 lg:border-r border-gray-200'>
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

          {activeTab === 'Carrito' ? (
            <CartSummary
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          ) : (
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
                  {renderDropdown(
                    'province',
                    formData.province,
                    provinceOptions
                  )}
                </div>

                <div>
                  <label className='block text-sm text-gray-600 mb-1'>
                    Distrito
                  </label>
                  {renderDropdown(
                    'district',
                    formData.district,
                    districtOptions
                  )}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Right column - Product Listing */}
        <div className='w-full lg:w-2/3 p-4'>
          <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
            <div className='w-full sm:w-auto sm:flex-grow sm:mr-4 mb-4 sm:mb-0'>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <button className='w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap'>
              Ver solicitud{' '}
              <span className='ml-1 bg-white text-blue-600 rounded-full px-2'>
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </button>
          </div>
          <ProductGrid searchQuery={searchQuery} addToCart={addToCart} />
        </div>
      </div>
    </Layout>
  )
}

export default MerchPage
