import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../config'
import Room from '../Room-Reservation/Room'
import { useEventContext } from './EventProvider'
import MaterialsSection from './MaterialsSection'
import MerchandisingSection from './MerchandisingSection'
const EventForm = () => {
  const navigate = useNavigate()
  const { updateDraftEvent, refreshEvents } = useEventContext()
  const [isLoading, setIsLoading] = useState(false)
  const [showRoomReservation, setShowRoomReservation] = useState(false)
  const [formError, setFormError] = useState(null)
  const { currentUser } = useSelector((state) => state.user)
  const [showRoomComponent, setShowRoomComponent] = useState(false)
  const [roomData, setRoomData] = useState(null)
  const initialFormState = {
    eventType: 'Congreso',
    isInternal: false,
    title: '',
    description: '',
    start: null,
    end: null,
    materials: false,
    trainer: false,
    merchandising: false,
    address: '',
    district: '',
    reference: '',
    province: '',
    department: '',
    selectedMaterials: [],
    selectedMerchandising: [],
    creator: currentUser?.data?.user?._id || '',
    commercialBrand: '', // Add this field
  }

  const [formData, setFormData] = useState(initialFormState)

  const provinceOptions = [
    { value: 'ABANCAY', label: 'ABANCAY' },
    { value: 'AREQUIPA', label: 'AREQUIPA' },
    { value: 'AYACUCHO', label: 'AYACUCHO' },
    { value: 'BARRANCA', label: 'BARRANCA' },
    { value: 'CAJAMARCA', label: 'CAJAMARCA' },
    { value: 'CAMANA', label: 'CAMANA' },
    { value: 'CHICLAYO', label: 'CHICLAYO' },
    { value: 'CHIMBOTE', label: 'CHIMBOTE' },
    { value: 'CHINCHA', label: 'CHINCHA' },
    { value: 'CUSCO', label: 'CUSCO' },
    { value: 'HUACHO', label: 'HUACHO' },
    { value: 'HUANCAYO', label: 'HUANCAYO' },
    { value: 'HUARAZ', label: 'HUARAZ' },
    { value: 'HUAURA', label: 'HUAURA' },
    { value: 'ICA', label: 'ICA' },
    { value: 'IQUITOS', label: 'IQUITOS' },
    { value: 'LIMA', label: 'LIMA' },
    { value: 'PIURA', label: 'PIURA' },
    { value: 'PUCALLPA', label: 'PUCALLPA' },
    { value: 'TACNA', label: 'TACNA' },
    { value: 'TRUJILLO', label: 'TRUJILLO' },
  ]

  const eventTypes = [
    { value: 'Congreso', label: 'Congreso' },
    { value: 'Seminario', label: 'Seminario' },
    { value: 'Taller', label: 'Taller' },
    { value: 'Conferencia', label: 'Conferencia' },
  ]

  const queryClient = useQueryClient()

  // Mutations
  const updateInventoryMutation = useMutation(
    (item) =>
      axiosInstance.patch(`/materials/${item._id}/update-availability`, {
        quantity: item.quantity,
        startDate: formData.start,
        endDate: formData.end,
        destination: formData.province, // Use province as destination for external events
        isInternal: formData.isInternal,
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
        if (!formData.isInternal) {
          resetForm()
          refreshEvents()
        }
      },
      onError: (error) => {
        console.error('Error creating event:', error)
        toast.error('Failed to create event')
      },
    }
  )

  // Effect to update draft event
  useEffect(() => {
    if (formData.start && formData.end) {
      updateDraftEvent({
        title: formData.title,
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
    formData.title,
    formData.selectedMaterials,
    formData.selectedMerchandising,
  ])

  // Form handlers
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
    setFormData(initialFormState)
    setFormError(null)
  }

  const handleRoomReservation = () => {
    setShowRoomComponent(true)
    setShowRoomReservation(false)
  }

  // Handle room reservation completion
  const handleRoomReservationComplete = () => {
    setShowRoomComponent(false)
    resetForm()
    refreshEvents()
  }

  if (showRoomComponent && roomData) {
    return (
      <Room
        eventTitle={roomData.eventTitle}
        startDate={roomData.startDate}
        endDate={roomData.endDate}
        isFromEvent={roomData.isFromEvent}
        onComplete={handleRoomReservationComplete}
      />
    )
  }

  const EMAIL_LISTS = {
    logistics: [
      'ivan.falla@straumann.com',
      'miguel.narvaez@straumann.com',
      'joaquin.ruiz@straumann.com',
      'sofia.faustor@straumann.com',
    ],
    marketing: [
      'gianluca.de.bari@straumann.com',
      'jocelyn.villanueva@straumann.com',
    ],
    education: [
      'lorena.alarco@straumann.com',
      'katherine.taboada@straumann.com',
      'carla.bustios@straumann.com',
      'daniel.huamani@straumann.com',
      'juan.zevallos@straumann.com',
      'rosa.villagra@straumann.com',
    ],
  }

  const sendEventNotifications = async (eventDetails) => {
    try {
      const { isInternal, trainer } = formData
      const creatorEmail = currentUser.data.user.email

      // Initialize recipients list
      let recipients = new Set([creatorEmail]) // Creator always receives the email

      // Add marketing team for all events
      EMAIL_LISTS.marketing.forEach((email) => recipients.add(email))

      if (!isInternal) {
        // External event: add logistics and education
        EMAIL_LISTS.logistics.forEach((email) => recipients.add(email))
        EMAIL_LISTS.education.forEach((email) => recipients.add(email))
      }

      const emailTemplate = createEmailTemplate(
        eventDetails,
        isInternal,
        trainer
      )

      // Send emails to all recipients
      await Promise.all(
        Array.from(recipients).map((email) =>
          axiosInstance.post('/email/send', {
            to: email,
            subject: `${
              isInternal ? 'Internal' : 'External'
            } Event Registration: ${formData.title}`,
            html: emailTemplate,
          })
        )
      )
    } catch (error) {
      console.error('Error sending notifications:', error)
      toast.error('Error sending event notifications')
      throw error
    }
  }

  const createEmailTemplate = (eventDetails, isInternal, trainer) => {
    const formattedDate = (date) => {
      return new Date(date).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${isInternal ? 'Internal' : 'External'} Event Registration</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #f8f9fa;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 5px;
        }
        .section {
          margin: 20px 0;
          padding: 15px;
          border-left: 3px solid #007bff;
          background-color: #f8f9fa;
        }
        .highlight {
          color: #007bff;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isInternal ? 'Internal' : 'External'} Event Registration - ${
      formData.title
    }</h1>
          <p>Created by: ${currentUser.data.user.name}</p>
        </div>

        <div class="section">
          <p><strong>Event Type:</strong> ${formData.eventType}</p>
          <p><strong>Start:</strong> ${formattedDate(formData.start)}</p>
          <p><strong>End:</strong> ${formattedDate(formData.end)}</p>
          ${
            trainer
              ? '<p class="highlight">Trainer Required for this Event</p>'
              : ''
          }
          ${
            formData.description
              ? `<p><strong>Description:</strong> ${formData.description}</p>`
              : ''
          }
        </div>

        ${
          !isInternal
            ? `
          <div class="section">
            <h3>Location Details:</h3>
            <p>Address: ${formData.address}</p>
            <p>District: ${formData.district}</p>
            <p>Province: ${formData.province}</p>
            <p>Department: ${formData.department}</p>
            ${
              formData.reference
                ? `<p>Reference: ${formData.reference}</p>`
                : ''
            }
          </div>
        `
            : ''
        }

        ${
          formData.materials && formData.selectedMaterials.length > 0
            ? `
          <div class="section">
            <h3>Materials Required:</h3>
            <ul>
              ${formData.selectedMaterials
                .map((m) => `<li>${m.name}: ${m.quantity}</li>`)
                .join('')}
            </ul>
          </div>
        `
            : ''
        }

        ${
          formData.merchandising && formData.selectedMerchandising.length > 0
            ? `
          <div class="section">
            <h3>Merchandising Items:</h3>
            <ul>
              ${formData.selectedMerchandising
                .map((m) => `<li>${m.name}: ${m.quantity}</li>`)
                .join('')}
            </ul>
          </div>
        `
            : ''
        }

        <div style="margin-top: 30px; font-size: 12px; color: #666;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
  }

  const validateForm = () => {
    if (!formData.title?.trim()) {
      setFormError('Please enter an event title.')
      return false
    }

    if (!formData.start || !formData.end) {
      setFormError('Please select start and end dates for the event.')
      return false
    }

    if (!formData.isInternal && !formData.province) {
      setFormError('Please select a province.')
      return false
    }

    if (formData.materials && formData.selectedMaterials.length === 0) {
      setFormError(
        'Please select at least one material or disable materials option.'
      )
      return false
    }

    if (formData.merchandising && formData.selectedMerchandising.length === 0) {
      setFormError(
        'Please select at least one merchandising item or disable merchandising option.'
      )
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setFormError(null)

    try {
      // Create event object
      const newEvent = {
        eventType: formData.eventType,
        title: formData.title,
        description: formData.description,
        start: formData.start,
        end: formData.end,
        isInternal: formData.isInternal,
        materials: formData.materials,
        selectedMaterials: formData.materials
          ? formData.selectedMaterials.map((material) => ({
              materialId: material._id,
              name: material.name,
              quantity: material.quantity,
            }))
          : [],
        merchandising: formData.merchandising,
        selectedMerchandising: formData.merchandising
          ? formData.selectedMerchandising.map((item) => ({
              merchandisingId: item._id,
              name: item.name,
              quantity: item.quantity,
            }))
          : [],
        creator: currentUser.data.user._id,
      }

      // Add external-specific fields if not internal
      if (!formData.isInternal) {
        Object.assign(newEvent, {
          trainer: formData.trainer,
          address: formData.address,
          reference: formData.reference,
          department: formData.department,
          province: formData.province,
          district: formData.district,
          destination: formData.province,
        })
      }

      // Update inventory if materials are selected
      if (formData.materials && formData.selectedMaterials.length > 0) {
        await Promise.all(
          formData.selectedMaterials.map((item) =>
            updateInventoryMutation.mutateAsync(item)
          )
        )
      }

      // Create the event
      const createdEvent = await createEventMutation.mutateAsync(newEvent)

      // Send notifications
      await sendEventNotifications(createdEvent)

      // Show success message
      toast.success('Event successfully registered!')

      // Handle internal event flow
      if (formData.isInternal) {
        setShowRoomReservation(true)
      } else {
        resetForm()
        refreshEvents()
      }

      // Invalidate queries
      queryClient.invalidateQueries('materials')
      queryClient.invalidateQueries('events')
    } catch (error) {
      console.error('Error processing event:', error)
      setFormError(`Failed to create event: ${error.message}`)
      toast.error(`Failed to create event: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Render helpers
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

  return (
    <div className='flex flex-col h-screen bg-white'>
      <h1 className='text-2xl font-bold p-4 border-b'>Eventos</h1>
      <div className='flex-grow overflow-y-auto px-4 py-2'>
        <form className='space-y-4'>
          {/* Title */}
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

          {/* Description */}
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

          {/* Event Type */}
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
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                size={20}
                className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none'
              />
            </div>
          </div>

          {/* Internal/External Toggle */}
          <Toggle
            name='isInternal'
            checked={formData.isInternal}
            onChange={handleInputChange}
            label='Evento Interno'
          />

          {/* Materials Toggle */}
          <Toggle
            name='materials'
            checked={formData.materials}
            onChange={handleInputChange}
            label='Materials'
          />

          {/* Materials Section */}
          {formData.materials && (
            <MaterialsSection formData={formData} setFormData={setFormData} />
          )}

          {/* Trainer Toggle - Only for external events */}
          {!formData.isInternal && (
            <Toggle
              name='trainer'
              checked={formData.trainer}
              onChange={handleInputChange}
              label='Trainer'
            />
          )}

          {/* Merchandising Toggle */}
          <Toggle
            name='merchandising'
            checked={formData.merchandising}
            onChange={handleInputChange}
            label='Merchandising'
          />

          {/* Merchandising Section */}
          {formData.merchandising && (
            <MerchandisingSection
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {/* Date Selection */}
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

          {/* Address Section - Only for external events */}
          {!formData.isInternal && (
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
        </form>
      </div>

      {/* Form Footer */}
      <div className='p-4 border-t'>
        {formError && (
          <div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
            role='alert'
          >
            <strong className='font-bold'>Error: </strong>
            <span className='block sm:inline'>{formError}</span>
          </div>
        )}
        <button
          type='button'
          className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Registrar evento'}
        </button>
      </div>

      {/* Room Reservation Dialog */}
      <Dialog open={showRoomReservation} onOpenChange={setShowRoomReservation}>
        <DialogContent className='sm:max-w-md'>
          <div className='p-4 space-y-4'>
            <p className='text-gray-600'>
              Would you like to proceed with room reservation for this internal
              event?
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => {
                  setShowRoomReservation(false)
                  resetForm()
                  refreshEvents()
                }}
                className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
              >
                Skip for now
              </button>
              <button
                onClick={handleRoomReservation}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
              >
                Proceed to Room Reservation
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Reservation Dialog */}
      <Dialog open={showRoomComponent} onOpenChange={setShowRoomComponent}>
        <DialogContent className='sm:max-w-7xl max-h-[90vh] overflow-y-auto'>
          <Room
            eventTitle={formData.title}
            startDate={formData.start}
            endDate={formData.end}
            description={formData.description}
            isFromEvent={true}
            onComplete={handleRoomReservationComplete}
            className='p-0'
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EventForm
