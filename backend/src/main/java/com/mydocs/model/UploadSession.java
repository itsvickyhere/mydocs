package com.mydocs.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "upload_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionId;     // UUID sent to frontend for SSE subscription

    private String fileName;

    private int progressPercent;  // 0–100

    private String status;        // "IN_PROGRESS", "DONE", "FAILED"

    @Column(nullable = false)
    private LocalDateTime startedAt = LocalDateTime.now();
}
