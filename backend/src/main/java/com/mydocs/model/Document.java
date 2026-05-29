package com.mydocs.model;

import jakarta.persistence.*;
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
    private String id;              // UUID set manually in service

    private String filename;        // stored name on disk (uuid_original.pdf)
    private String originalName;    // what user sees
    private Long size;
    private String mimeType;
    private String path;
    private String status = "complete";
    private LocalDateTime uploadedAt = LocalDateTime.now();
}