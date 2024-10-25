import { motion } from 'framer-motion'
import { Camera, Loader2, Lock, Save } from 'lucide-react'
import React, { useState } from 'react'
import Layout from './Layout'

const Setting = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [form, setForm] = useState({
    name: 'Test',
    email: 'test@test.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-2xl mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'
          >
            <div className='p-6 border-b border-gray-100'>
              <h1 className='text-2xl font-semibold text-gray-900'>Settings</h1>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-6'>
              {/* Profile Picture */}
              <div className='flex justify-center'>
                <motion.div whileHover={{ scale: 1.05 }} className='relative'>
                  <img
                    src='https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'
                    alt='Profile'
                    className='w-32 h-32 rounded-full object-cover'
                  />
                  <button className='absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors'>
                    <Camera className='w-4 h-4' />
                  </button>
                </motion.div>
              </div>

              {/* Profile Info */}
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Name
                  </label>
                  <input
                    type='text'
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className='w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className='w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow'
                  />
                </div>
              </div>

              {/* Password Update */}
              <div className='space-y-4'>
                <div className='flex items-center space-x-2 text-gray-800'>
                  <Lock className='w-4 h-4' />
                  <h2 className='font-medium'>Update Password</h2>
                </div>
                <div className='grid gap-4'>
                  <input
                    type='password'
                    placeholder='Current Password'
                    value={form.currentPassword}
                    onChange={(e) =>
                      setForm({ ...form, currentPassword: e.target.value })
                    }
                    className='w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow'
                  />
                  <input
                    type='password'
                    placeholder='New Password'
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                    className='w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow'
                  />
                  <input
                    type='password'
                    placeholder='Confirm New Password'
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    className='w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow'
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className='flex justify-end'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type='submit'
                  disabled={isLoading}
                  className='flex items-center px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50'
                >
                  {isLoading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <Save className='w-4 h-4 mr-2' />
                  )}
                  Save Changes
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className='fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg'
            >
              Settings saved successfully!
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Setting
