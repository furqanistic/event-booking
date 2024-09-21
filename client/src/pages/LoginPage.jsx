import { EyeIcon, EyeOffIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-500'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold text-center mb-6 text-blue-500'>
          straumanngroup
        </h1>
        <form>
          <div className='mb-4'>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Nombre de usuario o correo electrónico
            </label>
            <input
              type='text'
              id='username'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Julio C'
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
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='********'
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
            <input type='checkbox' id='remember' className='mr-2' />
            <label htmlFor='remember' className='text-sm text-gray-700'>
              Recuérdame
            </label>
          </div>
          <Link to='dashboard'>
            <button
              type='submit'
              className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Acceder
            </button>
          </Link>
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
