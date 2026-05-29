package com.mydocs.controller;

import com.mydocs.model.Notification;
import com.mydocs.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    /** GET /api/notifications — get all notifications newest first */
    @GetMapping
    public List<Notification> getAll() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    /** GET /api/notifications/unread — only unread */
    @GetMapping("/unread")
    public List<Notification> getUnread() {
        return notificationRepository.findByReadFalseOrderByCreatedAtDesc();
    }

    /** PUT /api/notifications/{id}/read — mark one as read */
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markRead(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + id));
        n.setRead(true);
        return ResponseEntity.ok(notificationRepository.save(n));
    }

    /** PUT /api/notifications/read-all — mark all as read */
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllRead() {
        List<Notification> unread = notificationRepository.findByReadFalseOrderByCreatedAtDesc();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.noContent().build();
    }
}
