package com.mydocs.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String fileName;

    private String fileType;      // e.g. "application/pdf"

    private Long fileSize;        // bytes

    private String storagePath;   // where file is saved on disk

    private String uploadedBy;    // future: tie to user

    @Column(nullable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    private String status;        // "UPLOADED", "PROCESSING", "DONE"
}
