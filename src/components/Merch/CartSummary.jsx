import React, { useState } from 'react'

const CartSummary = () => {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (item) => {
    setCartItems([...cartItems, item])
  }

  const removeFromCart = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index)
    setCartItems(newCartItems)
  }

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Carrito</h2>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index} className='flex justify-between items-center mb-2'>
              <span>{item.name}</span>
              <button
                onClick={() => removeFromCart(index)}
                className='text-red-500'
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CartSummary
