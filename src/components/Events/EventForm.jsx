import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { useEventContext } from './EventProvider'
import MaterialsSection from './MaterialsSection'
import MerchandisingSection from './MerchandisingSection'
const EventForm = () => {
  const { addEvent, updateDraftEvent } = useEventContext()
  const [formData, setFormData] = useState({
    eventType: 'Congreso',
    start: null,
    end: null,
    materials: false,
    sala: false,
    trainer: false,
    merchandising: false,
    address: '',
    reference: '',
    department: '1',
    province: '1',
    district: '1',
    selectedMaterials: [],
    roomCapacity: '',
    selectedRoom: '',
    assistants: '',
    selectedMerchandising: [],
  })

  useEffect(() => {
    if (formData.start && formData.end) {
      updateDraftEvent({
        title: formData.eventType,
        start: formData.start,
        end: formData.end,
      })
    }
  }, [formData.start, formData.end, formData.eventType])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({ ...prev, [name]: date }))
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

  const handleSubmit = (e) => {
    e.preventDefault()
    addEvent(formData)
    // Reset your form here
  }

  return (
    <div className='flex flex-col h-screen bg-white'>
      <h1 className='text-2xl font-bold p-4 border-b'>Eventos</h1>

      <div className='flex-grow overflow-y-auto px-4 py-2'>
        <form className='space-y-4'>
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

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Start Date & Time
              </label>
              <DatePicker
                selected={formData.start}
                onChange={(date) => handleDateChange(date, 'start')}
                showTimeSelect
                dateFormat='MMMM d, yyyy h:mm aa'
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
                showTimeSelect
                dateFormat='MMMM d, yyyy h:mm aa'
                className='w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
          {/* <Toggle
            name='sala'
            checked={formData.sala}
            onChange={handleInputChange}
            label='Sala'
          />

          {formData.sala && (
            <div className='space-y-4 border border-gray-200 rounded-md p-4'>
              <h3 className='font-medium text-gray-700'>Room</h3>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  How many people do you want to book?
                </label>
                <select
                  name='roomCapacity'
                  value={formData.roomCapacity}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select</option>
                  {[...Array(30)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i + 1 === 1 ? 'person' : 'people'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>Sala</label>
                <div className='flex space-x-2'>
                  <button
                    type='button'
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, selectedRoom: 'A' }))
                    }
                    className={`flex-1 p-2 border rounded-md ${
                      formData.selectedRoom === 'A'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    Room A
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, selectedRoom: 'B' }))
                    }
                    className={`flex-1 p-2 border rounded-md ${
                      formData.selectedRoom === 'B'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    Room B
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Assistants
                </label>
                <textarea
                  name='assistants'
                  value={formData.assistants}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  rows='3'
                ></textarea>
              </div>
            </div>
          )} */}

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

      <div className='p-4 border-t'>
        <button
          type='button'
          className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300'
          onClick={handleSubmit}
        >
          Registrar evento
        </button>
      </div>
    </div>
  )
}

export default EventForm
