import express from 'express'
import {
  sendBulkEmailController,
  sendEmailController,
} from '../controller/email.js'
import { restrictTo, verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// Protected email routes
router.use(verifyToken)

// Regular user can send single email
router.post('/send', sendEmailController)

// Only admin can send bulk emails
router.use(restrictTo('admin'))
router.post('/send-bulk', sendBulkEmailController)

export default router
