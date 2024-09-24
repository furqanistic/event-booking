import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8800/api/', // Adjust this URL to match your server
  withCredentials: true, // If you're using cookies for authentication
})
