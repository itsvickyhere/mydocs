package com.mydocs.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    private String id;              // UUID set manually in service

    private String message;
    private String type = "info";   // "success", "error", "info"
    private boolean read = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}