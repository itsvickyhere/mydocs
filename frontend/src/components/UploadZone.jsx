import { useState, useRef } from 'react'
import {
  Box, Typography, LinearProgress, Button, Paper
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useSnackbar } from 'notistack'
import { uploadDocument } from '../api'

export default function UploadZone({ onUploadSuccess }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef()
  const { enqueueSnackbar } = useSnackbar()

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    setProgress(0)
    try {
      await uploadDocument(file, setProgress)
      enqueueSnackbar(`${file.name} uploaded!`, { variant: 'success' })
      onUploadSuccess()
    } catch (err) {
      enqueueSnackbar('Upload failed. Try again.', { variant: 'error' })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <Paper
      variant="outlined"
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      sx={{
        p: 4,
        mb: 3,
        textAlign: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: dragging ? 'primary.main' : 'grey.400',
        bgcolor: dragging ? 'primary.50' : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
      <Typography variant="h6" gutterBottom>
        Drag & drop a file here
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        or click to browse
      </Typography>
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption">{progress}%</Typography>
        </Box>
      )}
    </Paper>
  )
}
