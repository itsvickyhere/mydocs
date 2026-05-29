import { useEffect, useState } from 'react'
import {
  Drawer, Box, Typography, List, ListItem, ListItemText,
  Divider, Button, Chip, Stack
} from '@mui/material'
import { getNotifications, markRead, markAllRead } from '../api'

export default function NotificationPanel({ open, onClose }) {
  const [notifications, setNotifications] = useState([])

  const load = async () => {
    try {
      const { data } = await getNotifications()
      setNotifications(data)
    } catch {
    }
  }

  useEffect(() => { if (open) load() }, [open])

  const handleMarkRead = async (id) => {
    await markRead(id)
    load()
  }

  const handleMarkAll = async () => {
    await markAllRead()
    load()
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={600}>Notifications</Typography>
          <Button size="small" onClick={handleMarkAll}>Mark all read</Button>
        </Stack>
        <Divider />

        {notifications.length === 0 && (
          <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            No notifications yet
          </Typography>
        )}

        <List sx={{ overflowY: 'auto', flex: 1 }}>
          {notifications.map((n) => (
            <ListItem
              key={n.id}
              onClick={() => !n.read && handleMarkRead(n.id)}
              sx={{
                bgcolor: n.read ? 'inherit' : 'action.hover',
                borderRadius: 1,
                mb: 0.5,
                cursor: n.read ? 'default' : 'pointer',
              }}
            >
              <ListItemText
                primary={n.message}
                secondary={new Date(n.createdAt).toLocaleString()}
              />
              <Chip
                label={n.type}
                size="small"
                color={n.type === 'success' ? 'success' : n.type === 'error' ? 'error' : 'default'}
                sx={{ ml: 1 }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}
