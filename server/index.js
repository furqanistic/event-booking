import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
// import admissionRoute from './routes/admission.js'
import authRoute from './routes/auth.js'

const app = express()
dotenv.config()
app.use(cookieParser())
app.use(express.json())
app.use(cors())
mongoose.set('strictQuery', true)
app.use('/api/auth/', authRoute)
// app.use('/api/admission/', admissionRoute)

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
