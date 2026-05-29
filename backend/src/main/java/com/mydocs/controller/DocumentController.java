package com.mydocs.controller;

import com.mydocs.model.Document;
import com.mydocs.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    /** GET /api/documents — list all documents */
    @GetMapping
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    /** GET /api/documents/{id} — get one document */
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    /** POST /api/documents/upload — upload a file (multipart/form-data) */
    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file) throws IOException {
        Document saved = documentService.uploadDocument(file);
        return ResponseEntity.ok(saved);
    }

    /** DELETE /api/documents/{id} — delete a document */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
