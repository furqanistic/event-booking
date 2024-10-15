import { destinationData } from '../../client/src/dataFile.js'
import Event from '../models/Event.js'
import { Material, Merchandising } from '../models/InventoryItem.js'

const restockItems = async (items, Model, startDate, endDate, destination) => {
  const { daysToReach, daysToReturn, cleaningDays } = destinationData[
    destination
  ] || { daysToReach: 0, daysToReturn: 0, cleaningDays: 0 }

  const fullStartDate = new Date(startDate)
  fullStartDate.setDate(fullStartDate.getDate() - daysToReach)

  const fullEndDate = new Date(endDate)
  fullEndDate.setDate(fullEndDate.getDate() + daysToReturn + cleaningDays)

  for (let item of items) {
    const doc = await Model.findById(item.materialId || item.merchandisingId)
    if (!doc) {
      console.warn(
        `Item with id ${item.materialId || item.merchandisingId} not found`
      )
      continue
    }

    for (
      let date = new Date(fullStartDate);
      date <= fullEndDate;
      date.setDate(date.getDate() + 1)
    ) {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      let monthEntry = doc.availability.find(
        (entry) => entry.year === year && entry.month === month
      )
      if (!monthEntry) {
        monthEntry = { year, month, days: [] }
        doc.availability.push(monthEntry)
      }

      let dayEntry = monthEntry.days.find((d) => d.day === day)
      if (!dayEntry) {
        dayEntry = { day, quantity: 0 }
        monthEntry.days.push(dayEntry)
      }

      dayEntry.quantity += item.quantity
    }

    // Sort availability array
    doc.availability.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })

    // Sort days array within each month
    doc.availability.forEach((month) => {
      month.days.sort((a, b) => a.day - b.day)
    })

    await doc.save()
  }
}

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found',
      })
    }

    // Restock materials
    if (event.materials && event.selectedMaterials.length > 0) {
      await restockItems(
        event.selectedMaterials,
        Material,
        event.start,
        event.end,
        event.destination
      )
    }

    // Restock merchandising
    if (event.merchandising && event.selectedMerchandising.length > 0) {
      await restockItems(
        event.selectedMerchandising,
        Merchandising,
        event.start,
        event.end,
        event.destination
      )
    }

    // Delete the event
    await Event.findByIdAndDelete(req.params.id)

    res.status(200).json({
      status: 'success',
      message: 'Event deleted and items restocked successfully',
    })
  } catch (err) {
    console.error('Error in deleteEvent:', err)
    res.status(400).json({
      status: 'error',
      message: err.message,
    })
  }
}

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
      title,
      description,
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
      !destination ||
      !title
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
      title,
      description,
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
      const { name, imagePath, MaxQuantity, availability } = req.body
      const newItem = new Model({ name, imagePath, MaxQuantity, availability })
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
  update: async (req, res) => {
    try {
      const { id } = req.params
      const { name, imagePath, MaxQuantity, startDate, endDate } = req.body

      const item = await Model.findById(id)
      if (!item) {
        return res.status(404).json({
          status: 'error',
          message: 'Item not found',
        })
      }

      // Calculate the quantity difference
      const quantityDifference = MaxQuantity - item.MaxQuantity

      // Update basic information
      item.name = name
      item.imagePath = imagePath
      item.MaxQuantity = MaxQuantity

      // If dates are provided, update availability
      if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)

        // Ensure start date is not in the past
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (start < today) {
          return res.status(400).json({
            status: 'error',
            message: 'Start date cannot be in the past',
          })
        }

        // Update availability for each day in the range
        for (
          let date = new Date(start);
          date <= end;
          date.setDate(date.getDate() + 1)
        ) {
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          const day = date.getDate()

          let monthEntry = item.availability.find(
            (entry) => entry.year === year && entry.month === month
          )
          if (!monthEntry) {
            monthEntry = { year, month, days: [] }
            item.availability.push(monthEntry)
          }

          let dayEntry = monthEntry.days.find((d) => d.day === day)
          if (!dayEntry) {
            dayEntry = { day, quantity: item.MaxQuantity }
            monthEntry.days.push(dayEntry)
          }

          // Update the quantity, ensuring it doesn't go below 0
          dayEntry.quantity = Math.max(
            0,
            dayEntry.quantity + quantityDifference
          )
        }

        // Sort availability array
        item.availability.sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year
          return a.month - b.month
        })

        // Sort days array within each month
        item.availability.forEach((month) => {
          month.days.sort((a, b) => a.day - b.day)
        })
      }

      await item.save()

      res.status(200).json({
        status: 'success',
        data: { item },
      })
    } catch (err) {
      console.error('Error in update:', err)
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
      const { quantity, startDate, endDate, destination } = req.body

      if (!destination) {
        return res.status(400).json({
          status: 'error',
          message:
            'Destination is required for calculating transportation and cleaning days',
        })
      }

      const material = await Material.findById(id)
      if (!material) {
        return res.status(404).json({
          status: 'error',
          message: 'Material not found',
        })
      }

      const start = new Date(startDate)
      const end = new Date(endDate)
      const { daysToReach, daysToReturn, cleaningDays } = destinationData[
        destination
      ] || { daysToReach: 0, daysToReturn: 0, cleaningDays: 0 }

      // Calculate the full range of dates to update
      const fullStartDate = new Date(start)
      fullStartDate.setDate(fullStartDate.getDate() - daysToReach)

      const fullEndDate = new Date(end)
      fullEndDate.setDate(fullEndDate.getDate() + daysToReturn + cleaningDays)

      for (
        let date = new Date(fullStartDate);
        date <= fullEndDate;
        date.setDate(date.getDate() + 1)
      ) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        let monthEntry = material.availability.find(
          (entry) => entry.year === year && entry.month === month
        )

        if (!monthEntry) {
          monthEntry = { year, month, days: [] }
          material.availability.push(monthEntry)
        }

        let dayEntry = monthEntry.days.find((d) => d.day === day)
        if (!dayEntry) {
          dayEntry = { day, quantity: material.MaxQuantity } // Use MaxQuantity if no entry exists
          monthEntry.days.push(dayEntry)
        }

        // Subtract the booked quantity from the available quantity
        dayEntry.quantity = Math.max(0, dayEntry.quantity - quantity)
      }

      // Sort availability array
      material.availability.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year
        return a.month - b.month
      })

      // Sort days array within each month
      material.availability.forEach((month) => {
        month.days.sort((a, b) => a.day - b.day)
      })

      await material.save()

      res.status(200).json({
        status: 'success',
        data: { material },
      })
    } catch (err) {
      console.error('Error in updateAvailability:', err)
      res.status(400).json({
        status: 'error',
        message: err.message,
      })
    }
  },

  bulkUpdateAvailability: async (req, res) => {
    try {
      const { id } = req.params
      const { year, month, days } = req.body

      const material = await Material.findById(id)
      if (!material) {
        return res.status(404).json({
          status: 'error',
          message: 'Material not found',
        })
      }

      // Find the index of the existing month/year combination, if it exists
      const existingIndex = material.availability.findIndex(
        (item) => item.year === year && item.month === month
      )

      if (existingIndex !== -1) {
        // Update existing month data
        material.availability[existingIndex] = { year, month, days }
      } else {
        // Add new month data
        material.availability.push({ year, month, days })
      }

      // Sort the availability array by year and month
      material.availability.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year
        return a.month - b.month
      })

      // Sort the days array within each month
      material.availability.forEach((month) => {
        month.days.sort((a, b) => a.day - b.day)
      })

      await material.save()

      res.status(200).json({
        status: 'success',
        data: { material },
      })
    } catch (err) {
      console.error('Error in bulkUpdateAvailability:', err)
      res.status(400).json({
        status: 'error',
        message: err.message,
      })
    }
  },

  checkAvailability: async (req, res) => {
    try {
      const { items, startDate, endDate } = req.body
      if (!items || !Array.isArray(items) || !startDate || !endDate) {
        return res
          .status(400)
          .json({ status: 'error', message: 'Invalid input' })
      }

      const checkStartDate = new Date(startDate)
      const checkEndDate = new Date(endDate)

      if (isNaN(checkStartDate.getTime()) || isNaN(checkEndDate.getTime())) {
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

          let minAvailableQuantity = Infinity

          // Check availability for each day in the range
          for (
            let d = new Date(checkStartDate);
            d <= checkEndDate;
            d.setDate(d.getDate() + 1)
          ) {
            const year = d.getFullYear()
            const month = d.getMonth() + 1
            const day = d.getDate()

            const monthData = material.availability.find(
              (a) => a.year === year && a.month === month
            )

            if (!monthData) {
              minAvailableQuantity = Math.min(
                minAvailableQuantity,
                material.MaxQuantity
              )
              continue
            }

            const dayData = monthData.days.find((d) => d.day === day)

            if (!dayData) {
              minAvailableQuantity = Math.min(
                minAvailableQuantity,
                material.MaxQuantity
              )
              continue
            }

            minAvailableQuantity = Math.min(
              minAvailableQuantity,
              dayData.quantity
            )
          }

          return {
            id: item._id,
            available: minAvailableQuantity >= item.quantity,
            requestedQuantity: item.quantity,
            availableQuantity: minAvailableQuantity,
            defaultQuantity: material.MaxQuantity,
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
