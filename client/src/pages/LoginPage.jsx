import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config'
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axiosInstance.post('auth/signin', {
        email: formData.email,
        password: formData.password,
      })

      if (response.data.status === 'success') {
        // Store the token in localStorage or a secure cookie
        localStorage.setItem('token', response.data.token)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'An error occurred. Please try again.'
      )
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-500'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold text-center mb-6 text-blue-500'>
          straumanngroup
        </h1>
        {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Correo electrónico
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='usuario@ejemplo.com'
              required
            />
          </div>
          <div className='mb-4 relative'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='********'
              required
            />
            <button
              type='button'
              className='absolute right-3 top-8 text-gray-500'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          <div className='mb-4 flex items-center'>
            <input
              type='checkbox'
              id='rememberMe'
              name='rememberMe'
              checked={formData.rememberMe}
              onChange={handleChange}
              className='mr-2'
            />
            <label htmlFor='rememberMe' className='text-sm text-gray-700'>
              Recuérdame
            </label>
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Acceder
          </button>
        </form>
        <div className='mt-4 text-center'>
          <a href='#' className='text-sm text-blue-500 hover:underline'>
            ¿Has olvidado tu contraseña?
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
