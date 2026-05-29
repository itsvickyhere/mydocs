import { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton, Box, CircularProgress, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import { viewUrl } from '../api'

export default function DocumentViewer({ open, document, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !document) {
      setBlobUrl(null)
      setError(false)
      return
    }

    let objectUrl = null
    setLoading(true)
    setError(false)

    axios.get(viewUrl(document.id), { responseType: 'blob' })
      .then((res) => {
        objectUrl = URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf' })
        )
        setBlobUrl(objectUrl)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [open, document])

  if (!document) return null

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {document.originalName}
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading && <CircularProgress />}
        {error && (
          <Typography color="error">
            Could not load PDF. Try re-uploading the file (database resets on backend restart).
          </Typography>
        )}
        {!loading && !error && blobUrl && (
          <Box
            component="iframe"
            src={blobUrl}
            title={document.originalName}
            sx={{ width: '100%', height: '100%', border: 0 }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
