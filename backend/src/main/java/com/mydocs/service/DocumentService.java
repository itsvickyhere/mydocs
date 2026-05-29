package com.mydocs.service;

import com.mydocs.model.Document;
import com.mydocs.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final SseService sseService;

    // Upload directory (creates if not exists)
    private static final String UPLOAD_DIR = "uploads/";

    public Document uploadDocument(MultipartFile file) throws IOException {
        // Create uploads folder if missing
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file to disk with unique name
        String uniqueName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(uniqueName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Save metadata to DB
        Document doc = new Document();
        doc.setFileName(file.getOriginalFilename());
        doc.setFileType(file.getContentType());
        doc.setFileSize(file.getSize());
        doc.setStoragePath(filePath.toString());
        doc.setUploadedAt(LocalDateTime.now());
        doc.setStatus("UPLOADED");

        Document saved = documentRepository.save(doc);

        // Push SSE notification to all connected clients
        sseService.sendEvent("upload", "File uploaded: " + file.getOriginalFilename());

        return saved;
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found: " + id));
    }

    public void deleteDocument(Long id) {
        Document doc = getDocumentById(id);
        // Delete file from disk
        try {
            Files.deleteIfExists(Paths.get(doc.getStoragePath()));
        } catch (IOException e) {
            // Log but don't fail — DB record still gets deleted
        }
        documentRepository.deleteById(id);
        sseService.sendEvent("delete", "File deleted: " + doc.getFileName());
    }
}
