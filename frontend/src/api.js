import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const uploadFiles = (formData, onProgress) =>
  axios.post(`${BASE}/api/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: e => onProgress(Math.round((e.loaded / e.total) * 100))
  })

export const getDocuments     = () => axios.get(`${BASE}/api/documents`)
export const getNotifications = () => axios.get(`${BASE}/api/notifications`)
export const markRead         = id => axios.patch(`${BASE}/api/notifications/${id}/read`)
export const markAllRead      = () => axios.patch(`${BASE}/api/notifications/read-all`)
export const viewUrl          = id => `${BASE}/api/documents/${id}/download?inline=true`
export const downloadUrl      = id => `${BASE}/api/documents/${id}/download`
export const deleteDocument   = id => axios.delete(`${BASE}/api/documents/${id}`)

export const SSE_URL = `${BASE}/api/events`
