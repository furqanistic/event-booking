import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { axiosInstance } from '../../config'
import { useEventContext } from './EventProvider'
import MaterialsSection from './MaterialsSection'
import MerchandisingSection from './MerchandisingSection'
const EventForm = () => {
  const { updateDraftEvent, refreshEvents } = useEventContext()
  const [isLoading, setIsLoading] = useState(false)
  const { currentUser } = useSelector((state) => state.user)

  const [formData, setFormData] = useState({
    eventType: 'Congreso',
    title: '',
    description: '',
    start: null,
    end: null,
    materials: false,
    sala: false,
    trainer: false,
    merchandising: false,
    address: '',
    reference: '',
    department: 'Amazonas',
    province: 'Chachapoyas',
    district: 'Chachapoyas',
    selectedMaterials: [],
    roomCapacity: '',
    selectedRoom: '',
    assistants: '',
    destination: 'ABANCAY',
    selectedMerchandising: [],
    creator: '',
  })
  const [formError, setFormError] = useState(null)

  const destinationOptions = [
    { value: 'ABANCAY', label: 'ABANCAY' },
    { value: 'AREQUIPA', label: 'AREQUIPA' },
    { value: 'AYACUCHO', label: 'AYACUCHO' },
    { value: 'BARRANCA', label: 'BARRANCA' },
    { value: 'CAJAMARCA', label: 'CAJAMARCA' },
    { value: 'CAMANA', label: 'CAMANA' },
    { value: 'CHICLAYO', label: 'CHICLAYO' },
    { value: 'CHIMBOTE', label: 'CHIMBOTE' },
    { value: 'CHINCHA', label: 'CHINCHA' },
    { value: 'HUAURA', label: 'HUAURA' },
    { value: 'HUARAL', label: 'HUARAL' },
    { value: 'HUACHO', label: 'HUACHO' },
    { value: 'HUANCAYO', label: 'HUANCAYO' },
    { value: 'HUARAZ', label: 'HUARAZ' },
    { value: 'ICA', label: 'ICA' },
    { value: 'ILO', label: 'ILO' },
    { value: 'JULIACA', label: 'JULIACA' },
    { value: 'MOQUEGUA', label: 'MOQUEGUA' },
    { value: 'NAZCA', label: 'NAZCA' },
    { value: 'PISCO', label: 'PISCO' },
    { value: 'PIURA', label: 'PIURA' },
    { value: 'PUNO', label: 'PUNO' },
    { value: 'CUSCO', label: 'CUSCO' },
    { value: 'SULLANA', label: 'SULLANA' },
    { value: 'TACNA', label: 'TACNA' },
    { value: 'TRUJILLO', label: 'TRUJILLO' },
    { value: 'TUMBES', label: 'TUMBES' },
    { value: 'ANDAHUAYLAS', label: 'ANDAHUAYLAS' },
    { value: 'HUANUCO', label: 'HUANUCO' },
    { value: 'HUNCAVELICA', label: 'HUNCAVELICA' },
    { value: 'IQUITOS', label: 'IQUITOS' },
    { value: 'PUCALLPA', label: 'PUCALLPA' },
    { value: 'TARAPOTO', label: 'TARAPOTO' },
    { value: 'SAN MARTIN', label: 'SAN MARTIN' },
  ]

  const queryClient = useQueryClient()

  const updateInventoryMutation = useMutation(
    (item) =>
      axiosInstance.patch(`/materials/${item._id}/update-availability`, {
        quantity: item.quantity,
        startDate: formData.start,
        endDate: formData.end,
        destination: formData.destination,
      }),

    {
      onError: (error) => {
        console.error('Error updating inventory:', error)
        toast.error('Failed to update inventory')
      },
    }
  )

  const createEventMutation = useMutation(
    (newEvent) => axiosInstance.post('/events/', newEvent),
    {
      onSuccess: () => {
        toast.success('Event successfully registered!')
        resetForm()
        refreshEvents()
      },
      onError: (error) => {
        console.error('Error creating event:', error)
        toast.error('Failed to create event')
      },
    }
  )

  useEffect(() => {
    if (formData.start && formData.end) {
      updateDraftEvent({
        title: formData.eventType,
        start: formData.start,
        end: formData.end,
        details: {
          selectedMaterials: formData.selectedMaterials,
          selectedMerchandising: formData.selectedMerchandising,
        },
      })
    }
  }, [
    formData.start,
    formData.end,
    formData.eventType,
    formData.selectedMaterials,
    formData.selectedMerchandising,
  ])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleDateChange = (date, name) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (date < today) {
      toast.error("You can't select a past date.")
      return
    }

    if (name === 'end' && formData.start && date < formData.start) {
      toast.error("End date can't be earlier than start date.")
      return
    }

    setFormData((prev) => ({ ...prev, [name]: date }))
  }

  const resetForm = () => {
    setFormData({
      eventType: 'Congreso',
      start: null,
      end: null,
      materials: false,
      sala: false,
      trainer: false,
      merchandising: false,
      address: '',
      reference: '',
      department: '',
      title: '',
      description: '',
      province: '',
      district: '',
      destination: '',
      selectedMaterials: [],
      roomCapacity: '',
      selectedRoom: '',
      assistants: '',
      selectedMerchandising: [],
      creator: currentUser.data.user._id,
    })
    setFormError(null)
  }

  const renderDropdown = (name, value, options) => (
    <div className='relative'>
      <select
        name={name}
        value={value || options[0].label} // Use the first option as default if value is empty
        onChange={handleInputChange}
        className='w-full border border-gray-300 rounded-md p-2 appearance-none'
      >
        {options.map((option) => (
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
  )

  const Toggle = ({ name, checked, onChange, label }) => (
    <div className='flex items-center justify-between p-3 border border-gray-200 rounded-md'>
      <span className='text-sm font-medium text-gray-700'>{label}</span>
      <label className='relative inline-block h-6 w-11 cursor-pointer'>
        <input
          className='sr-only peer'
          type='checkbox'
          name={name}
          checked={checked}
          onChange={onChange}
        />
        <span className='absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-blue-600'></span>
        <span className='absolute inset-y-0 start-0 m-0.5 h-5 w-5 rounded-full bg-white transition-all peer-checked:start-5'></span>
      </label>
    </div>
  )

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

  const provinceOptions = [
    { value: '1', label: 'Chachapoyas' },
    { value: '2', label: 'Bagua' },
    { value: '3', label: 'Bongara' },
    { value: '4', label: 'Condorcanqui' },
    { value: '5', label: 'Luya' },
    { value: '6', label: 'Rodriguez De Mendoza' },
    { value: '7', label: 'Utcubamba' },
  ]

  const districtOptions = [
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation checks
    if (!formData.start || !formData.end) {
      setFormError('Please select start and end dates for the event.')
      return
    }

    if (!formData.title?.trim()) {
      setFormError('Please enter an event title.')
      return
    }

    if (!formData.destination) {
      setFormError('Please select a destination.')
      return
    }

    if (formData.materials && formData.selectedMaterials.length === 0) {
      setFormError(
        'Please select at least one material or disable materials option.'
      )
      return
    }

    if (formData.merchandising && formData.selectedMerchandising.length === 0) {
      setFormError(
        'Please select at least one merchandising item or disable merchandising option.'
      )
      return
    }

    setIsLoading(true)
    setFormError(null)

    const newEvent = {
      eventType: formData.eventType,
      title: formData.title,
      description: formData.description,
      start: formData.start,
      end: formData.end,
      materials: formData.materials,
      selectedMaterials: formData.selectedMaterials.map((material) => ({
        materialId: material._id,
        name: material.name,
        quantity: material.quantity,
      })),
      trainer: formData.trainer,
      merchandising: formData.merchandising,
      selectedMerchandising: formData.selectedMerchandising.map((item) => ({
        merchandisingId: item._id,
        name: item.name,
        quantity: item.quantity,
      })),
      address: formData.address,
      reference: formData.reference,
      department: formData.department,
      province: formData.province,
      district: formData.district,
      destination: formData.destination,
      creator: currentUser.data.user._id,
    }

    try {
      // First, update inventory for selected materials
      if (formData.materials && formData.selectedMaterials.length > 0) {
        await Promise.all(
          formData.selectedMaterials.map((item) =>
            updateInventoryMutation.mutateAsync({
              ...item,
              startDate: formData.start,
              endDate: formData.end,
              destination: formData.destination,
            })
          )
        )
      }

      // Create the event
      const createdEvent = await createEventMutation.mutateAsync(newEvent)

      // Send email notifications
      const NOTIFICATION_EMAILS = [
        currentUser.data.user.email, // Event creator
        'tcavalcanti.freelance@gmail.com',
        'gianluca.de.bari@straumann.com',
        'jocelyn.villanueva@straumann.com',
        'ivan.falla@straumann.com	',
        'miguel.narvaez@straumann.com',
        'joaquin.ruiz@straumann.com',
        'sofia.faustor@straumann.com',
      ]

      const eventEmailDetails = {
        subject: `Event Registration: ${formData.title}`,
        text: `New Event Registration from ${currentUser.data.user.name}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Event Registration Details</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #2563eb; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px; text-align: center;">Event Registration Confirmation</h1>
            </div>

            <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 20px;">
              <div style="margin-bottom: 20px;">
                <h2 style="color: #374151; margin: 0 0 10px 0;">${
                  formData.title
                }</h2>
                <p><strong>Event Type:</strong> ${formData.eventType}</p>
                <p><strong>Date Range:</strong> ${formData.start.toLocaleDateString()} to ${formData.end.toLocaleDateString()}</p>
                <p><strong>Destination:</strong> ${formData.destination}</p>
              </div>

              ${
                formData.materials && formData.selectedMaterials.length > 0
                  ? `
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <h3 style="color: #1f2937; margin: 0 0 10px 0;">Reserved Materials</h3>
                  <ul style="margin: 0; padding-left: 20px;">
                    ${formData.selectedMaterials
                      .map(
                        (item) => `
                      <li>${item.name} - Quantity: ${item.quantity}</li>
                    `
                      )
                      .join('')}
                  </ul>
                </div>
              `
                  : ''
              }

              ${
                formData.merchandising &&
                formData.selectedMerchandising.length > 0
                  ? `
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <h3 style="color: #1f2937; margin: 0 0 10px 0;">Merchandising Items</h3>
                  <ul style="margin: 0; padding-left: 20px;">
                    ${formData.selectedMerchandising
                      .map(
                        (item) => `
                      <li>${item.name} - Quantity: ${item.quantity}</li>
                    `
                      )
                      .join('')}
                  </ul>
                </div>
              `
                  : ''
              }

              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0;">Event Location</h3>
                <p style="margin: 0;">
                  ${formData.address ? `Address: ${formData.address}<br>` : ''}
                  ${
                    formData.reference
                      ? `Reference: ${formData.reference}<br>`
                      : ''
                  }
                  Department: ${formData.department}<br>
                  Province: ${formData.province}<br>
                  District: ${formData.district}
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
              <p>This is an automated message for your event registration.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      }

      // Send emails to all recipients
      await Promise.all(
        NOTIFICATION_EMAILS.map(async (email) => {
          try {
            await axiosInstance.post('/email/send', {
              to: email,
              ...eventEmailDetails,
            })
          } catch (error) {
            console.error(`Failed to send email to ${email}:`, error)
            // Don't throw here, continue with other emails
          }
        })
      )

      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries('materials')
      queryClient.invalidateQueries('events')

      // Show success message and reset form
      toast.success('Event successfully registered and notifications sent!')
      resetForm()
      refreshEvents()
    } catch (error) {
      console.error('Error processing event:', error.response || error)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred'
      setFormError(`Failed to create event: ${errorMessage}`)

      toast.error(`Failed to create event: ${errorMessage}`, {
        duration: 5000,
        style: {
          background: 'rgb(249, 167, 167)',
          color: 'black',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col h-screen bg-white'>
      <h1 className='text-2xl font-bold p-4 border-b'>Eventos</h1>

      <div className='flex-grow overflow-y-auto px-4 py-2'>
        <form className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-black mb-1'>
              Título del evento:
            </label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              className='w-full border border-gray-300 text-gray-900 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-black mb-1'>
              Descripción del evento:
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='w-full border border-gray-300 text-gray-900 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows='3'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-blue-600 mb-1'>
              Tipo de evento:
            </label>
            <div className='relative'>
              <select
                name='eventType'
                value={formData.eventType}
                onChange={handleInputChange}
                className='w-full border border-blue-300 text-gray-900 rounded-md p-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='Congreso'>Congreso</option>
                <option value='Seminario'>Seminario</option>
                <option value='Taller'>Taller</option>
                <option value='Conferencia'>Conferencia</option>
              </select>
              <ChevronDownIcon
                size={20}
                className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none'
              />
            </div>
          </div>

          <Toggle
            name='materials'
            checked={formData.materials}
            onChange={handleInputChange}
            label='Materials'
          />

          {formData.materials && (
            <MaterialsSection formData={formData} setFormData={setFormData} />
          )}

          <Toggle
            name='trainer'
            checked={formData.trainer}
            onChange={handleInputChange}
            label='Trainer'
          />
          <Toggle
            name='merchandising'
            checked={formData.merchandising}
            onChange={handleInputChange}
            label='Merchandising'
          />

          {formData.merchandising && (
            <MerchandisingSection
              formData={formData}
              setFormData={setFormData}
            />
          )}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Start Date & Time
              </label>
              <DatePicker
                selected={formData.start}
                onChange={(date) => handleDateChange(date, 'start')}
                dateFormat='MMMM d, yyyy'
                minDate={new Date()}
                className='w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                End Date & Time
              </label>
              <DatePicker
                selected={formData.end}
                onChange={(date) => handleDateChange(date, 'end')}
                dateFormat='MMMM d, yyyy'
                minDate={formData.start || new Date()}
                className='w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
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
            <div>
              <label className='block text-sm text-gray-600 mb-1'>
                Destino
              </label>
              {renderDropdown(
                'destination',
                formData.destination,
                destinationOptions
              )}
            </div>
          </div>
        </form>
      </div>

      <div className='p-4 border-t'>
        {formError && (
          <div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
            role='alert'
          >
            <strong className='font-bold'>Error: </strong>
            <span className='block sm:inline'>{formError}</span>
          </div>
        )}
        <button
          type='button'
          className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300'
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Registrar evento'}
        </button>
      </div>
    </div>
  )
}

export default EventForm
