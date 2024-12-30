import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { CheckCircle2, ChevronDownIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import CartSummary from '../components/Merch/CartSummary'
import ProductGrid from '../components/Merch/ProductGrid'
import SearchBar from '../components/Merch/SearchBar'
import { axiosInstance } from '../config'
import Layout from './Layout'
const MerchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Carrito')
  const [cartItems, setCartItems] = useState([])
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const { currentUser } = useSelector((state) => state.user)
  const [statusMessage, setStatusMessage] = useState('')
  const [showStatus, setShowStatus] = useState(false)
  const [statusType, setStatusType] = useState('loading')
  const [deliveryMethod, setDeliveryMethod] = useState('delivery')
  const [formData, setFormData] = useState({
    address: '',
    reference: '',
    department: '',
    province: '',
    district: '',
  })

  const showLoadingStatus = (message) => {
    setStatusMessage(message)
    setStatusType('loading')
    setShowStatus(true)
  }

  const showSuccessStatus = (message) => {
    setStatusMessage(message)
    setStatusType('success')
    // Keep success message visible for longer (5 seconds)
    setTimeout(() => {
      setShowStatus(false)
      // Reset to cart view after success message disappears
      setActiveTab('Carrito')
    }, 5000)
  }

  const showErrorStatus = (message) => {
    setStatusMessage(message)
    setStatusType('error')
    setTimeout(() => setShowStatus(false), 3000) // Hide after 3 seconds
  }

  // Email configuration
  const MARKETING_EMAILS = [
    'jocelyn.villanueva@straumann.com',
    'gianluca.de.bari@straumann.com',
  ]

  const LOGISTICS_EMAILS = [
    'tcavalcanti.freelance@gmail.com',
    'lorena.alarco@straumann.com',
    'daniel.huamani@straumann.com',
    'juan.zevallos@straumann.com',
    'rosa.villagra@straumann.com',
    'katherine.taboada@straumann.com',
    'carla.bustios@straumann.com',
  ]

  const formatOrderDetails = (cartItems, formData) => {
    const orderDate = new Date().toLocaleDateString()
    const orderTime = new Date().toLocaleTimeString()
    const orderNumber = `ORDER-${Date.now()}`

    const itemsList = cartItems
      .map((item) => `- ${item.name} x ${item.quantity}`)
      .join('\n')

    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    )

    const deliveryDetails =
      deliveryMethod === 'delivery'
        ? `
        Address: ${formData.address}
        Reference: ${formData.reference || 'N/A'}
        Department: ${getLabelForValue(departmentOptions, formData.department)}
        Province: ${getLabelForValue(provinceOptions, formData.province)}
        District: ${getLabelForValue(districtOptions, formData.district)}
      `
        : 'Pickup from Straumann Office'

    const customerDetails = `
      Name: ${currentUser.data.user.name}
      Email: ${currentUser.data.user.email}
    `

    return {
      subject: `New ${
        deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'
      } Order #${orderNumber} - ${orderDate}`,
      text: `New Order from ${currentUser.data.user.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Order Notification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Company Header -->
            <div style="background-color: #2563eb; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px; text-align: center;">
                Straumann Group - New ${
                  deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'
                } Order
              </h1>
            </div>

            <!-- Main Content -->
            <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 20px;">
              <!-- Order Info -->
              <div style="margin-bottom: 20px;">
                <p style="color: #374151; font-size: 16px; margin: 4px 0;">
                  <strong>Order Number:</strong> ${orderNumber}
                </p>
                <p style="color: #374151; font-size: 16px; margin: 4px 0;">
                  <strong>Date:</strong> ${orderDate}
                </p>
                <p style="color: #374151; font-size: 16px; margin: 4px 0;">
                  <strong>Time:</strong> ${orderTime}
                </p>
              </div>

              <!-- Customer Info -->
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0;">Customer Information</h3>
                <pre style="margin: 0; font-family: Arial, sans-serif;">${customerDetails}</pre>
              </div>

              <!-- Order Details -->
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0;">Order Details</h3>
                <pre style="margin: 0; font-family: Arial, sans-serif;">${itemsList}</pre>
                <hr style="border: 1px solid #e5e7eb; margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>Total Items:</strong> ${totalItems}</p>
              </div>

              <!-- Delivery/Pickup Info -->
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0;">
                  ${
                    deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'
                  } Information
                </h3>
                <pre style="margin: 0; font-family: Arial, sans-serif;">${deliveryDetails}</pre>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
              <p>This is an automated message from Straumann Grp's order system.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }
  }

  const sendOrderEmails = async (orderDetails) => {
    try {
      const emailList =
        deliveryMethod === 'pickup'
          ? MARKETING_EMAILS
          : [...MARKETING_EMAILS, ...LOGISTICS_EMAILS]

      await Promise.all(
        emailList.map(async (email) => {
          const response = await axiosInstance.post('/email/send', {
            to: email,
            ...orderDetails,
          })
          return response.data
        })
      )
    } catch (error) {
      console.error('Error sending emails:', error)
      throw error
    }
  }

  const handleConfirmOrder = async () => {
    try {
      setIsConfirmationOpen(false)
      showLoadingStatus('Processing your order...')

      // Format order details for email
      const orderDetails = formatOrderDetails(cartItems, formData)

      // Send email notifications
      await sendOrderEmails(orderDetails)

      // Clear cart and reset form
      setCartItems([])
      setFormData({
        address: '',
        reference: '',
        department: '',
        province: '',
        district: '',
      })

      // Show enhanced success message
      showSuccessStatus(
        'Your order has been successfully placed! You will receive a confirmation email shortly. Thank you for your purchase! 🎉'
      )
    } catch (error) {
      console.error('Error processing order:', error)
      showErrorStatus(
        error.message ||
          'There was an error processing your order. Please try again or contact us.'
      )
    }
  }

  const getLabelForValue = (options, value) => {
    const option = options.find((opt) => opt.value === value)
    return option ? option.label : value
  }

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

  const StatusModal = () => {
    return (
      <Dialog
        open={showStatus}
        onOpenChange={() => statusType !== 'loading' && setShowStatus(false)}
      >
        <DialogContent className='sm:max-w-md flex flex-col items-center justify-center p-6'>
          {statusType === 'loading' && (
            <>
              <Loader2 className='h-12 w-12 animate-spin text-blue-500 mb-4' />
              <h3 className='text-lg font-semibold text-center'>
                {statusMessage}
              </h3>
              <p className='text-sm text-gray-500 text-center mt-2'>
                Please wait while we process your request
              </p>
            </>
          )}

          {statusType === 'success' && (
            <Alert className='border-green-500 bg-green-50'>
              <AlertTitle className='text-green-800 flex items-center gap-2'>
                <CheckCircle2 className='h-5 w-5' />
                Order Confirmed!
              </AlertTitle>
              <AlertDescription className='text-green-700 mt-2'>
                {statusMessage}
                <div className='mt-4 text-sm'>
                  You can contact us, if you face any problem!
                </div>
              </AlertDescription>
            </Alert>
          )}

          {statusType === 'error' && (
            <Alert className='border-red-500 bg-red-50'>
              <AlertTitle className='text-red-800 flex items-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
                Error
              </AlertTitle>
              <AlertDescription className='text-red-700'>
                {statusMessage}
              </AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    )
  }

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

  const handleConfirmPurchase = () => {
    setIsConfirmationOpen(true)
  }

  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method)
    if (method === 'pickup') {
      // Reset delivery-related form fields
      setFormData({
        address: '',
        reference: '',
        department: '',
        province: '',
        district: '',
      })
    }
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
            <>
              <CartSummary
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
              {cartItems.length > 0 && (
                <button
                  className='w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded'
                  onClick={() => setActiveTab('Registra tu pedido')}
                >
                  Proceder al registro
                </button>
              )}
            </>
          ) : (
            <>
              <form className='space-y-4'>
                {/* Delivery Method Selection */}
                <div className='space-y-4 border border-gray-200 rounded-md p-4'>
                  <h3 className='font-medium text-gray-700'>
                    Método de entrega
                  </h3>
                  <div className='flex space-x-4'>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        value='delivery'
                        checked={deliveryMethod === 'delivery'}
                        onChange={(e) =>
                          handleDeliveryMethodChange(e.target.value)
                        }
                        className='mr-2'
                      />
                      Delivery
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        value='pickup'
                        checked={deliveryMethod === 'pickup'}
                        onChange={(e) =>
                          handleDeliveryMethodChange(e.target.value)
                        }
                        className='mr-2'
                      />
                      Recoger
                    </label>
                  </div>
                </div>

                {/* Address Form - Only show if delivery is selected */}
                {deliveryMethod === 'delivery' && (
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
                        Distrito:
                      </label>
                      <input
                        type='text'
                        name='district'
                        value={formData.district}
                        onChange={handleInputChange}
                        className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>

                    <div>
                      <label className='block text-sm text-gray-600 mb-1'>
                        Referencia:
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
                        Provincia:
                      </label>
                      <div className='relative'>
                        <select
                          name='province'
                          value={formData.province}
                          onChange={handleInputChange}
                          className='w-full border border-gray-300 rounded-md p-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                          <option value=''>Select Province</option>
                          {provinceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon
                          size={20}
                          className='absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm text-gray-600 mb-1'>
                        Departamento:
                      </label>
                      <input
                        type='text'
                        name='department'
                        value={formData.department}
                        onChange={handleInputChange}
                        className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                  </div>
                )}

                {/* Pickup Information - Only show if pickup is selected */}
                {deliveryMethod === 'pickup' && (
                  <div className='space-y-4 border border-gray-200 rounded-md p-4'>
                    <h3 className='font-medium text-gray-700'>
                      Información de recojo
                    </h3>
                    <p className='text-gray-600'>
                      Puedes recoger tu pedido aquí:
                    </p>
                    <div className='bg-gray-50 p-4 rounded'>
                      <p className='font-medium'>Straumann Group</p>
                      <p>You will receive pickup details via an email.</p>
                    </div>
                  </div>
                )}
              </form>

              <button
                className='w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded'
                onClick={handleConfirmPurchase}
                disabled={
                  deliveryMethod === 'delivery'
                    ? !formData.address ||
                      !formData.department ||
                      !formData.province ||
                      !formData.district
                    : false
                }
              >
                Confirmar pedido
              </button>
            </>
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
      {/* Custom Confirmation Modal */}
      {isConfirmationOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50'>
          <div className='bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl'>
            <div className='p-6 space-y-6'>
              <h2 className='text-2xl font-bold text-gray-900 border-b pb-3'>
                Confirmar Pedido
              </h2>

              <div className='space-y-6'>
                <div>
                  <h3 className='font-semibold text-xl text-gray-800 mb-3'>
                    Resumen del pedido
                  </h3>
                  <ul className='divide-y divide-gray-200'>
                    {cartItems.map((item, index) => (
                      <li
                        key={index}
                        className='py-3 flex justify-between items-center'
                      >
                        <span className='text-gray-800 font-medium'>
                          {item.name}
                        </span>
                        <span className='text-gray-600 font-medium'>
                          x{item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className='mt-4 text-right'>
                    <p className='text-lg font-semibold text-gray-800'>
                      Total de artículos:{' '}
                      {cartItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </p>
                  </div>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='font-semibold text-xl text-gray-800 mb-3'>
                    Dirección de envío
                  </h3>
                  <div className='space-y-2 text-gray-700'>
                    <p className='font-medium'>{formData.address}</p>
                    {formData.reference && (
                      <p>Referencia: {formData.reference}</p>
                    )}
                    <p>
                      {getLabelForValue(districtOptions, formData.district)},{' '}
                      {getLabelForValue(provinceOptions, formData.province)}
                    </p>
                    <p>
                      {getLabelForValue(departmentOptions, formData.department)}
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex justify-end space-x-4 pt-6 border-t'>
                <button
                  className='px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                  onClick={() => setIsConfirmationOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  onClick={handleConfirmOrder}
                >
                  Confirmar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <StatusModal />
    </Layout>
  )
}

export default MerchPage
