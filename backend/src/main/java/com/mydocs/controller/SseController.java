package com.mydocs.controller;

import com.mydocs.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/sse")
@RequiredArgsConstructor
public class SseController {

    private final SseService sseService;

    /**
     * GET /api/sse/subscribe
     * Frontend calls this once on mount.
     * Returns a persistent SSE stream — server pushes events whenever
     * a document is uploaded, deleted, etc.
     */
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        return sseService.register();
    }
}
