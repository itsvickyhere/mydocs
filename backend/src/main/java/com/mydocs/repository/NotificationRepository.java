package com.mydocs.repository;

import com.mydocs.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // All unread notifications
    List<Notification> findByReadFalseOrderByCreatedAtDesc();

    // All notifications newest first
    List<Notification> findAllByOrderByCreatedAtDesc();
}
