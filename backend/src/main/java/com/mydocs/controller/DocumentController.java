package com.mydocs.controller;

import com.mydocs.model.Document;
import com.mydocs.repository.DocumentRepository;
import com.mydocs.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final DocumentRepository docRepo;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("files") MultipartFile[] files) {
        for (MultipartFile f : files) {
            if (!"application/pdf".equals(f.getContentType())) {
                return ResponseEntity.badRequest().body("Only PDFs allowed");
            }
        }
        try {
            return ResponseEntity.ok(documentService.handleUpload(files));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/documents")
    public List<Document> getAll() {
        return docRepo.findAllByOrderByUploadedAtDesc();
    }

    @GetMapping("/documents/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable String id) throws IOException {
        Document doc = docRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        Resource resource = new UrlResource(Paths.get(doc.getPath()).toUri());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + doc.getOriginalName() + "\"")
            .body(resource);
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}