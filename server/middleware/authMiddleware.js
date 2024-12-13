import jwt from 'jsonwebtoken'
import { createError } from '../error.js'
import User from '../models/User.js'

export const verifyToken = async (req, res, next) => {
  try {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt
    }

    if (!token) {
      return next(
        createError(401, 'You are not logged in! Please log in to get access.')
      )
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      console.error('Token verification failed:', err.message)
      return next(createError(401, 'Invalid token. Please log in again.'))
    }

    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
      console.log('User not found in database')
      return next(
        createError(401, 'The user belonging to this token no longer exists.')
      )
    }

    req.user = currentUser
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
