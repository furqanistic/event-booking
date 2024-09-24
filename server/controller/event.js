import Event from '../models/Event.js'
import { Material, Merchandising } from '../models/InventoryItem.js'

const reserveItems = async (items, model, date) => {
  for (let item of items) {
    const doc = await model.findById(item.materialId || item.merchandisingId)
    if (!doc) {
      throw new Error(
        `Item with id ${item.materialId || item.merchandisingId} not found`
      )
    }

    const availableQuantity =
      doc.totalQuantity -
      doc.reservations.reduce((sum, reservation) => {
        return (
          sum +
          (reservation.date.getTime() === date.getTime()
            ? reservation.quantity
            : 0)
        )
      }, 0)

    if (availableQuantity < item.quantity) {
      throw new Error(`Not enough quantity available for ${doc.name}`)
    }

    doc.reservations.push({
      date: date,
      quantity: item.quantity,
    })
    await doc.save()
  }
}

export const createEvent = async (req, res) => {
  try {
    const {
      eventType,
      start,
      end,
      materials,
      trainer,
      merchandising,
      address,
      reference,
      department,
      province,
      district,
      destination,
      selectedMaterials,
      selectedMerchandising,
    } = req.body

    // Validate required fields
    if (
      !eventType ||
      !start ||
      !end ||
      !address ||
      !department ||
      !province ||
      !district ||
      !destination
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      })
    }

    const startDate = new Date(start)

    // Reserve materials if selected
    if (
      materials &&
      Array.isArray(selectedMaterials) &&
      selectedMaterials.length > 0
    ) {
      await reserveItems(selectedMaterials, Material, startDate)
    }

    // Reserve merchandising if selected
    if (
      merchandising &&
      Array.isArray(selectedMerchandising) &&
      selectedMerchandising.length > 0
    ) {
      await reserveItems(selectedMerchandising, Merchandising, startDate)
    }

    // Create and save the new event
    const newEvent = new Event({
      eventType,
      start: startDate,
      end: new Date(end),
      materials,
      selectedMaterials,
      trainer,
      merchandising,
      selectedMerchandising,
      address,
      reference,
      department,
      province,
      district,
      destination,
    })

    const savedEvent = await newEvent.save()

    res.status(201).json({
      status: 'success',
      data: {
        event: savedEvent,
      },
    })
  } catch (err) {
    console.error('Error creating event:', err)
    res.status(400).json({
      status: 'error',
      message: err.message,
    })
  }
}

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    })
  }
}

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'name email') // Populate creator with name and email
      .populate('participants', 'name email') // Populate participants with name and email

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found',
      })
    }

    res.status(200).json({
      status: 'success',
      data: {
        event,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    })
  }
}

export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    if (!updatedEvent) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found',
      })
    }
    res.status(200).json({
      status: 'success',
      data: {
        event: updatedEvent,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    })
  }
}

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found',
      })
    }
    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    })
  }
}

// Total number of events
export const getTotalEvents = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments()

    res.status(200).json({
      status: 'success',
      data: {
        totalEvents,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    })
  }
}

const createInventoryController = (Model) => ({
  create: async (req, res) => {
    try {
      const { name, totalQuantity, imagePath } = req.body
      const newItem = new Model({ name, totalQuantity, imagePath })
      await newItem.save()
      res.status(201).json({
        status: 'success',
        data: { item: newItem },
      })
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err.message,
      })
    }
  },

  getAll: async (req, res) => {
    try {
      const items = await Model.find()
      res.status(200).json({
        status: 'success',
        data: { items },
      })
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err.message,
      })
    }
  },

  updateQuantity: async (req, res) => {
    try {
      const { id } = req.params
      const updateData = req.body

      const item = await Model.findById(id)
      if (!item) {
        return res.status(404).json({
          status: 'error',
          message: 'Item not found',
        })
      }

      // Update fields
      if (updateData.name) item.name = updateData.name
      if (updateData.imagePath) item.imagePath = updateData.imagePath
      if (updateData.totalQuantity !== undefined)
        item.totalQuantity = updateData.totalQuantity

      // Handle reservations
      if (Array.isArray(updateData.reservations)) {
        item.reservations = updateData.reservations.map((reservation) => ({
          date: new Date(reservation.date),
          quantity: reservation.quantity,
        }))
      }

      await item.save()

      res.status(200).json({
        status: 'success',
        data: { item },
      })
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err.message,
      })
    }
  },

  checkAvailability: async (req, res) => {
    try {
      const { items, startDate, endDate } = req.body

      console.log('Checking availability for:', { items, startDate, endDate })

      if (!items || !Array.isArray(items) || !startDate || !endDate) {
        return res
          .status(400)
          .json({ status: 'error', message: 'Invalid input' })
      }

      const start = new Date(startDate)
      const end = new Date(endDate)

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res
          .status(400)
          .json({ status: 'error', message: 'Invalid date format' })
      }

      const availabilityChecks = await Promise.all(
        items.map(async (item) => {
          const material = await Material.findById(item._id)
          if (!material) {
            return {
              id: item._id,
              available: false,
              message: 'Material not found',
            }
          }

          const reservedQuantity = material.reservations.reduce(
            (total, reservation) => {
              const reservationDate = new Date(reservation.date)
              if (reservationDate >= start && reservationDate <= end) {
                return total + reservation.quantity
              }
              return total
            },
            0
          )

          const availableQuantity = material.totalQuantity - reservedQuantity

          return {
            id: item._id,
            available: availableQuantity >= item.quantity,
            requestedQuantity: item.quantity,
            availableQuantity: availableQuantity,
          }
        })
      )

      const allAvailable = availabilityChecks.every((check) => check.available)
      console.log('Final availability result:', {
        allAvailable,
        items: availabilityChecks,
      })
      return res.status(200).json({
        status: 'success',
        available: allAvailable,
        items: availabilityChecks,
      })
    } catch (error) {
      console.error('Error checking material availability:', error)
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' })
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params
      const deletedItem = await Model.findByIdAndDelete(id)
      if (!deletedItem) {
        return res.status(404).json({
          status: 'error',
          message: 'Item not found',
        })
      }
      res.status(200).json({
        status: 'success',
        message: 'Item deleted successfully',
        data: { item: deletedItem },
      })
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err.message,
      })
    }
  },
})

export const MaterialController = createInventoryController(Material)
export const MerchandisingController = createInventoryController(Merchandising)
