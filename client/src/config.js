import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'http://147.79.82.94/api/',
  // baseURL: 'http://localhost:8800/api/',
  withCredentials: true, // If you're using cookies for authentication
})
