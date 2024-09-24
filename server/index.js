import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
// import admissionRoute from './routes/admission.js'
import cors from 'cors'
import authRoute from './routes/auth.js'
import eventRoutes from './routes/event.js'

const app = express()
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true, // This allows cookies and credentials to be sent
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
dotenv.config()
app.use(cookieParser())
app.use(express.json())

mongoose.set('strictQuery', true)
app.use('/api/auth', authRoute)
app.use('/api/', eventRoutes)

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((err) => console.log(err))
}

app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})
app.listen(8800, () => {
  connect()
  console.log('Server running at 8800')
})
