import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: ['Congreso', 'Seminario', 'Taller', 'Conferencia'],
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    materials: {
      type: Boolean,
      default: false,
    },
    selectedMaterials: [
      {
        materialId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    trainer: {
      type: Boolean,
      default: false,
    },
    merchandising: {
      type: Boolean,
      default: false,
    },
    selectedMerchandising: [
      {
        merchandisingId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    address: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
    },
    department: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Event', EventSchema)
