import axios from 'axios'

// Base URL — Vite proxy forwards /api → http://localhost:8080/api
const BASE = '/api'

// ── Documents ────────────────────────────────────────

/** Fetch all documents */
export const fetchDocuments = () =>
  axios.get(`${BASE}/documents`).then(r => r.data)

/** Upload a file (multipart/form-data) */
export const uploadDocument = (file, onProgress) => {
  const form = new FormData()
  form.append('file', file)
  return axios.post(`${BASE}/documents/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: e => {
      if (onProgress) {
        onProgress(Math.round((e.loaded * 100) / e.total))
      }
    },
  }).then(r => r.data)
}

/** Delete a document by ID */
export const deleteDocument = (id) =>
  axios.delete(`${BASE}/documents/${id}`)

// ── Notifications ────────────────────────────────────

/** Fetch all notifications */
export const fetchNotifications = () =>
  axios.get(`${BASE}/notifications`).then(r => r.data)

/** Mark one notification as read */
export const markNotificationRead = (id) =>
  axios.put(`${BASE}/notifications/${id}/read`).then(r => r.data)

/** Mark all notifications as read */
export const markAllRead = () =>
  axios.put(`${BASE}/notifications/read-all`)
