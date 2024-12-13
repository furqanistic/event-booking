import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: ['Congreso', 'Seminario', 'Taller', 'Conferencia'],
    },
    isInternal: {
      type: Boolean,
      required: true,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Material',
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
        date: {
          type: Date,
          required: true,
        },
      },
    ],
    merchandising: {
      type: Boolean,
      default: false,
    },
    selectedMerchandising: [
      {
        merchandisingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Merchandising',
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
        date: {
          type: Date,
          required: true,
        },
      },
    ],
    // External event specific fields
    address: {
      type: String,
      required: function () {
        return !this.isInternal
      },
    },
    reference: {
      type: String,
    },
    department: {
      type: String,
      required: function () {
        return !this.isInternal
      },
    },
    province: {
      type: String,
      required: function () {
        return !this.isInternal
      },
    },
    district: {
      type: String,
      required: function () {
        return !this.isInternal
      },
    },
    destination: {
      type: String,
      required: function () {
        return !this.isInternal
      },
    },
    trainer: {
      type: Boolean,
      default: false,
    },
    roomReservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoomReservation',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    extendDate: {
      type: Number,
    },
    extensionNotes: [
      {
        date: {
          type: Date,
          required: true,
        },
        note: {
          type: String,
          required: true,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Event', EventSchema)
