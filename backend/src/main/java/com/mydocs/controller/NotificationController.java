package com.mydocs.controller;

import com.mydocs.model.Notification;
import com.mydocs.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository repo;

    @GetMapping("/notifications")
    public List<Notification> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    @PatchMapping("/notifications/{id}/read")
    public void markRead(@PathVariable String id) {
        repo.findById(id).ifPresent(n -> { n.setRead(true); repo.save(n); });
    }

    @PatchMapping("/notifications/read-all")
    public void markAllRead() {
        repo.findAll().forEach(n -> { n.setRead(true); repo.save(n); });
    }
}