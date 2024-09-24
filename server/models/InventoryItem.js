import mongoose from 'mongoose'

const InventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  imagePath: {
    type: String,
  },
  reservations: [
    {
      date: Date,
      quantity: Number,
    },
  ],
})

export const Material = mongoose.model('Material', InventoryItemSchema)
export const Merchandising = mongoose.model(
  'Merchandising',
  InventoryItemSchema
)
