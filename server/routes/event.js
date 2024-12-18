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
  updateExtendDate,
} from '../controller/event.js'

const router = express.Router()

// Event routes
router.post('/events', createEvent)
router.get('/events/total', getTotalEvents)
router.get('/events', getAllEvents)
router.get('/events/:id', getEvent)
router.put('/events/:id', updateEvent)
router.put('/events/:id/extend', updateExtendDate)
router.delete('/events/:id', deleteEvent)

// Material routes
router.post('/materials', MaterialController.create)
router.get('/materials', MaterialController.getAll)
router.patch('/materials/:id', MaterialController.update)
router.patch(
  '/materials/:id/update-availability',
  MaterialController.updateAvailability
)
router.patch(
  '/materials/:id/bulk-update',
  MaterialController.bulkUpdateAvailability
) // New route
router.post(
  '/materials/check-availability',
  MaterialController.checkAvailability
)
router.delete('/materials/:id', MaterialController.delete)
router.get('/materials/:id', MaterialController.getSpecificMaterial)

// Merchandising routes
// Merchandising routes
router.post('/merchandising', MerchandisingController.create)
router.get('/merchandising', MerchandisingController.getAll)
router.patch('/merchandising/:id', MerchandisingController.update)
router.patch(
  '/merchandising/:id/update-availability',
  MerchandisingController.updateAvailability
)
router.post(
  '/merchandising/check-availability',
  MerchandisingController.checkAvailability
)
router.delete('/merchandising/:id', MerchandisingController.delete)

export default router
