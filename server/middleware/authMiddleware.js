import jwt from 'jsonwebtoken'
import { createError } from '../error.js'
import User from '../models/User.js'

export const verifyToken = async (req, res, next) => {
  try {
    console.log('Entering verifyToken middleware')
    console.log('Headers:', JSON.stringify(req.headers, null, 2))

    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
      console.log('Token extracted from Authorization header:', token)
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt
      console.log('Token extracted from cookies:', token)
    }

    if (!token) {
      console.log('No token found')
      return next(
        createError(401, 'You are not logged in! Please log in to get access.')
      )
    }

    console.log('Verifying token')
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('Decoded token:', decoded)
    } catch (err) {
      console.error('Token verification failed:', err.message)
      return next(createError(401, 'Invalid token. Please log in again.'))
    }

    console.log('Finding user with id:', decoded.id)
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
      console.log('User not found in database')
      return next(
        createError(401, 'The user belonging to this token no longer exists.')
      )
    }

    console.log('User found:', currentUser)
    req.user = currentUser
    console.log('req.user set to:', req.user)
    next()
  } catch (err) {
    console.error('Error in verifyToken:', err)
    next(createError(500, 'An error occurred while authenticating'))
  }
}

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('Checking user role. User:', req.user)
    if (!req.user) {
      return next(createError(401, 'User not authenticated'))
    }
    if (!roles.includes(req.user.role)) {
      return next(
        createError(403, 'You do not have permission to perform this action')
      )
    }
    next()
  }
}
