import React from 'react'

const CartSummary = ({ cartItems, removeFromCart, updateQuantity }) => {
  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0)
  const getTotalPrice = () =>
    cartItems.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0
    )

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>Carrito</h2>
      {cartItems.length === 0 ? (
        <p className='text-gray-500 text-center'>Tu carrito está vacío</p>
      ) : (
        <>
          <ul className='space-y-4'>
            {cartItems.map((item, index) => (
              <li
                key={index}
                className='flex items-center space-x-4 border-b pb-4'
              >
                <img
                  src='https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png'
                  alt={item.name}
                  className='w-16 h-16 object-cover rounded'
                />
                <div className='flex-grow'>
                  <h3 className='font-semibold text-gray-800'>{item.name}</h3>
                  <p className='text-sm text-gray-500'>
                    ${(item.price || 0).toFixed(2)}
                  </p>
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() =>
                      updateQuantity(index, Math.max(1, item.quantity - 1))
                    }
                    className='bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300'
                  >
                    -
                  </button>
                  <span className='font-semibold'>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className='bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300'
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className='text-red-500 hover:text-red-700'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <div className='mt-6 border-t pt-4'>
            <div className='flex justify-between items-center mb-2'>
              <span className='font-semibold text-gray-600'>Total Items:</span>
              <span className='font-bold text-gray-800'>{getTotalItems()}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CartSummary
