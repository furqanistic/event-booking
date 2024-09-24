import jwt from 'jsonwebtoken'
import { createError } from '../error.js'
import User from '../models/User.js'

const signToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables')
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  })
}

const createSendToken = (user, statusCode, res) => {
  try {
    const token = signToken(user._id)
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          (parseInt(process.env.JWT_COOKIE_EXPIRES_IN) || 1) *
            24 *
            60 *
            60 *
            1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    }

    res.cookie('jwt', token, cookieOptions)

    // Remove password from output
    user.password = undefined

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    })
  } catch (error) {
    console.error('Error in createSendToken:', error)
    throw error
  }
}

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return next(createError(400, 'Please provide name, email, and password'))
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(createError(400, 'User with this email already exists'))
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      role,
    })

    // Send token to the new user
    createSendToken(newUser, 201, res)
  } catch (err) {
    console.error('Error in signup:', err)
    next(createError(500, 'An unexpected error occurred during signup'))
  }
}

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return next(createError(400, 'Please provide email and password'))
    }
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(createError(401, 'Incorrect email or password'))
    }
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })
    createSendToken(user, 200, res)
  } catch (err) {
    console.error('Error in signin:', err)
    next(createError(500, 'An unexpected error occurred'))
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updatedUser) {
      return next(createError(404, 'No user found with that ID'))
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
      }
    )

    if (!user) {
      return next(createError(404, 'No user found with that ID'))
    }

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return next(createError(404, 'No user found with that ID'))
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isDeleted: false })

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password')

    if (
      !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
      return next(createError(401, 'Your current password is wrong'))
    }

    user.password = req.body.newPassword
    await user.save()

    createSendToken(user, 200, res)
  } catch (error) {
    next(error)
  }
}
