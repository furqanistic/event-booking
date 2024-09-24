import express from 'express'
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  getTotalEvents,
  MaterialController,
  MerchandisingController,
  updateEvent,
} from '../controller/event.js'

const router = express.Router()

// Event routes
router.post('/events', createEvent)
router.get('/events/total', getTotalEvents)
router.get('/events', getAllEvents)
router.get('/events/:id', getEvent)
router.put('/events/:id', updateEvent)
router.delete('/events/:id', deleteEvent)

// Material routes
router.post('/materials', MaterialController.create)
router.get('/materials', MaterialController.getAll)
router.patch('/materials/:id', MaterialController.updateQuantity)
router.post(
  '/materials/check-availability',
  MaterialController.checkAvailability
)
router.delete('/materials/:id', MaterialController.delete)

// Merchandising routes
router.post('/merchandising', MerchandisingController.create)
router.get('/merchandising', MerchandisingController.getAll)
router.patch('/merchandising/:id', MerchandisingController.updateQuantity)
router.post(
  '/merchandising/check-availability',
  MerchandisingController.checkAvailability
)
router.delete('/merchandising/:id', MerchandisingController.delete)

export default router
