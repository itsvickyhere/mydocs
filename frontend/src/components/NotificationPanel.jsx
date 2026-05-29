import { useEffect, useState } from 'react'
import {
  Drawer, Box, Typography, List, ListItem,
  ListItemText, Divider, Button, Chip
} from '@mui/material'
import { fetchNotifications, markAllRead, markNotificationRead } from '../api'

export default function NotificationPanel({ open, onClose }) {
  const [notifications, setNotifications] = useState([])

  const load = async () => {
    try {
      const data = await fetchNotifications()
      setNotifications(data)
    } catch {
      // fail silently — panel is non-critical
    }
  }

  useEffect(() => {
    if (open) load()
  }, [open])

  const handleMarkAllRead = async () => {
    await markAllRead()
    load()
  }

  const handleMarkRead = async (id) => {
    await markNotificationRead(id)
    load()
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 340, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">Notifications</Typography>
          <Button size="small" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        </Box>
        <Divider />

        {notifications.length === 0 && (
          <Typography color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            No notifications yet
          </Typography>
        )}

        <List dense>
          {notifications.map((n) => (
            <ListItem
              key={n.id}
              sx={{ bgcolor: n.read ? 'inherit' : 'action.hover', borderRadius: 1, mb: 0.5 }}
              onClick={() => !n.read && handleMarkRead(n.id)}
              button
            >
              <ListItemText
                primary={n.message}
                secondary={new Date(n.createdAt).toLocaleString()}
              />
              <Chip
                label={n.type}
                size="small"
                color={
                  n.type === 'SUCCESS' ? 'success' :
                  n.type === 'ERROR' ? 'error' : 'default'
                }
                sx={{ ml: 1 }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}
