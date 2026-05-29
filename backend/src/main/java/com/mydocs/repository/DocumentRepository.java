package com.mydocs.repository;

import com.mydocs.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    // Find all docs by status (e.g. "UPLOADED")
    List<Document> findByStatus(String status);

    // Find docs by uploader name
    List<Document> findByUploadedBy(String uploadedBy);
}
