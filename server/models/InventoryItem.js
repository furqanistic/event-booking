import mongoose from 'mongoose'

const DailyAvailabilitySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
)

const MonthlyAvailabilitySchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    days: [DailyAvailabilitySchema],
  },
  { _id: false }
)

const InventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  imagePath: {
    type: String,
  },
  MaxQuantity: {
    type: Number,
    required: true,
    min: 0,
  },

  availability: [MonthlyAvailabilitySchema],
})

export const Material = mongoose.model('Material', InventoryItemSchema)
export const Merchandising = mongoose.model(
  'Merchandising',
  InventoryItemSchema
)
