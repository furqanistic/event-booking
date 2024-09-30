import Event from '../models/Event.js'
import { Material, Merchandising } from '../models/InventoryItem.js'

const updateItemAvailability = async (items, model, startDate, endDate) => {
  for (let item of items) {
    const doc = await model.findById(item.materialId || item.merchandisingId)
    if (!doc) {
      throw new Error(
        `Item with id ${item.materialId || item.merchandisingId} not found`
      )
    }

    // Find all availability entries that fall within the event's date range
    const relevantAvailability = doc.availability.filter(
      (a) => a.date >= startDate && a.date <= endDate
    )

    // Check if there's enough quantity available for all relevant dates
    for (let avail of relevantAvailability) {
      if (avail.quantity < item.quantity) {
        throw new Error(
          `Not enough quantity available for ${
            doc.name
          } on ${avail.date.toDateString()}`
        )
      }
      avail.quantity -= item.quantity
    }

    await doc.save()
  }
}

// Backend: createEvent function (update)
export const createEvent = async (req, res) => {
  try {
    const {
      eventType,
      start,
      end,
      materials,
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
    const endDate = new Date(end)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format for start or end date',
      })
    }

    // Add date to selectedMaterials and selectedMerchandising
    const processedSelectedMaterials = selectedMaterials.map((item) => ({
      ...item,
      date: startDate,
    }))

    const processedSelectedMerchandising = selectedMerchandising.map(
      (item) => ({
        ...item,
        date: startDate,
      })
    )

    // Create and save the new event
    const newEvent = new Event({
      eventType,
      start: startDate,
      end: endDate,
      materials,
      selectedMaterials: processedSelectedMaterials,
      merchandising,
      selectedMerchandising: processedSelectedMerchandising,
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
      const { name, imagePath, availability } = req.body
      const newItem = new Model({ name, imagePath, availability })
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

  updateAvailability: async (req, res) => {
    try {
      const { id } = req.params
      const { name, imagePath, availability } = req.body

      const item = await Model.findById(id)
      if (!item) {
        return res.status(404).json({
          status: 'error',
          message: 'Item not found',
        })
      }

      // Update fields
      if (name) item.name = name
      if (imagePath) item.imagePath = imagePath
      if (Array.isArray(availability)) {
        // Clear existing availability data
        item.availability = []

        // Process and add new availability data
        availability.forEach((monthData) => {
          if (
            !monthData.year ||
            !monthData.month ||
            !Array.isArray(monthData.days)
          ) {
            throw new Error('Invalid availability data structure')
          }

          const existingMonthIndex = item.availability.findIndex(
            (a) => a.year === monthData.year && a.month === monthData.month
          )

          if (existingMonthIndex !== -1) {
            // Update existing month data
            item.availability[existingMonthIndex] = monthData
          } else {
            // Add new month data
            item.availability.push(monthData)
          }
        })

        // Sort availability array by year and month
        item.availability.sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year
          return a.month - b.month
        })
      }

      const updatedItem = await item.save()

      res.status(200).json({
        status: 'success',
        data: { item: updatedItem },
      })
    } catch (err) {
      console.error('Error in updateAvailability:', err)
      res.status(400).json({
        status: 'error',
        message: err.message,
      })
    }
  },

  checkAvailability: async (req, res) => {
    try {
      const { items, date } = req.body

      if (!items || !Array.isArray(items) || !date) {
        return res
          .status(400)
          .json({ status: 'error', message: 'Invalid input' })
      }

      const checkDate = new Date(date)

      if (isNaN(checkDate.getTime())) {
        return res
          .status(400)
          .json({ status: 'error', message: 'Invalid date format' })
      }

      const availabilityChecks = await Promise.all(
        items.map(async (item) => {
          const material = await Model.findById(item._id)
          if (!material) {
            return {
              id: item._id,
              available: false,
              message: 'Material not found',
            }
          }

          const monthData = material.availability.find(
            (a) =>
              a.year === checkDate.getFullYear() &&
              a.month === checkDate.getMonth() + 1
          )

          if (!monthData) {
            return {
              id: item._id,
              available: false,
              message: 'No availability data for the specified month',
            }
          }

          const dayData = monthData.days.find(
            (d) => d.day === checkDate.getDate()
          )

          if (!dayData) {
            return {
              id: item._id,
              available: false,
              message: 'No availability data for the specified date',
            }
          }

          return {
            id: item._id,
            available: dayData.quantity >= item.quantity,
            requestedQuantity: item.quantity,
            availableQuantity: dayData.quantity,
          }
        })
      )

      const allAvailable = availabilityChecks.every((check) => check.available)

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
  getSpecificMaterial: async (req, res) => {
    try {
      const { id } = req.params

      const material = await Material.findById(id)

      if (!material) {
        return res.status(404).json({
          status: 'error',
          message: 'Material not found',
        })
      }

      res.status(200).json({
        status: 'success',
        data: { material },
      })
    } catch (err) {
      console.error('Error in getSpecificMaterial:', err)
      res.status(400).json({
        status: 'error',
        message: err.message,
      })
    }
  },
})

export const MaterialController = createInventoryController(Material)
export const MerchandisingController = createInventoryController(Merchandising)
