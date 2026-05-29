package com.mydocs.service;

import com.mydocs.model.Document;
import com.mydocs.model.Notification;
import com.mydocs.repository.DocumentRepository;
import com.mydocs.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository docRepo;
    private final NotificationRepository notifRepo;
    private final SseService sseService;

    private static final String UPLOAD_DIR = "uploads/";

    public List<Document> handleUpload(MultipartFile[] files) throws IOException {
        new File(UPLOAD_DIR).mkdirs();
        boolean isBulk = files.length > 3;
        List<Document> saved = new ArrayList<>();

        for (MultipartFile file : files) {
            String id = UUID.randomUUID().toString();
            String filename = id + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + filename);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            Document doc = new Document(
                id, filename, file.getOriginalFilename(),
                file.getSize(), file.getContentType(),
                path.toString(), "complete", LocalDateTime.now()
            );
            saved.add(docRepo.save(doc));
        }

        if (isBulk) {
            String msg = files.length + " files uploaded successfully";
            notifRepo.save(new Notification(
                UUID.randomUUID().toString(), msg, "success", false, LocalDateTime.now()
            ));
            Map<String, Object> event = Map.of(
                "type", "bulk_complete",
                "count", files.length,
                "message", msg,
                "timestamp", LocalDateTime.now().toString()
            );
            sseService.broadcast(event);
        } else {
            for (MultipartFile f : files) {
                String msg = "\"" + f.getOriginalFilename() + "\" uploaded successfully";
                notifRepo.save(new Notification(
                    UUID.randomUUID().toString(), msg, "success", false, LocalDateTime.now()
                ));
                sseService.sendEvent("upload", msg);
            }
        }
        return saved;
    }

    public void deleteDocument(String id) {
        docRepo.findById(id).ifPresent(doc -> {
            try { Files.deleteIfExists(Paths.get(doc.getPath())); } catch (IOException ignored) {}
            docRepo.deleteById(id);
            sseService.sendEvent("delete", "File deleted: " + doc.getOriginalName());
        });
    }
}