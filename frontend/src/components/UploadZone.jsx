import { useState, useRef } from 'react'
import { Box, Typography, LinearProgress, Paper, Chip } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useSnackbar } from 'notistack'
import { uploadFiles } from '../api'

export default function UploadZone({ onUploadSuccess }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({}) // { filename: percent }
  const inputRef = useRef()
  const { enqueueSnackbar } = useSnackbar()

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)

    // PDF validation on frontend too
    const nonPdf = fileArray.find((f) => f.type !== 'application/pdf')
    if (nonPdf) {
      enqueueSnackbar('Only PDF files are allowed', { variant: 'error' })
      return
    }

    // Bulk toast if > 3 files
    if (fileArray.length > 3) {
      enqueueSnackbar(`Uploading ${fileArray.length} files...`, { variant: 'info' })
    }

    const form = new FormData()
    fileArray.forEach((f) => form.append('files', f))

    setUploading(true)

    try {
      await uploadFiles(form, (percent) => {
        // Single progress bar for the whole batch
        setProgress({ batch: percent })
      })
      enqueueSnackbar(
        fileArray.length > 3 ? `${fileArray.length} files uploaded!` : `${fileArray[0].name} uploaded!`,
        { variant: 'success' }
      )
      onUploadSuccess()
    } catch (err) {
      enqueueSnackbar('Upload failed. Try again.', { variant: 'error' })
    } finally {
      setUploading(false)
      setProgress({})
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <Paper
      variant="outlined"
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => !uploading && inputRef.current.click()}
      sx={{
        p: 5,
        mb: 3,
        textAlign: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: dragging ? 'primary.main' : 'grey.400',
        bgcolor: dragging ? 'primary.50' : 'background.paper',
        cursor: uploading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <CloudUploadIcon sx={{ fontSize: 52, color: 'primary.main', mb: 1 }} />
      <Typography variant="h6" gutterBottom>
        Drag & drop PDFs here
      </Typography>
      <Typography variant="body2" color="text.secondary">
        or click to browse — multiple files supported
      </Typography>

      {uploading && (
        <Box sx={{ mt: 3, px: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress.batch ?? 0}
            sx={{ borderRadius: 1, height: 8 }}
          />
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
            {progress.batch ?? 0}%
          </Typography>
        </Box>
      )}
    </Paper>
  )
}
