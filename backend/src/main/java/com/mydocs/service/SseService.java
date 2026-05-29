package com.mydocs.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {

    // Thread-safe list of all connected SSE clients
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    /** Called by SseController — registers a new frontend client */
    public SseEmitter register() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // no timeout

        emitters.add(emitter);

        // Clean up when client disconnects
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        return emitter;
    }

    /** Broadcasts an event to ALL connected clients */
    public void sendEvent(String eventName, String data) {
        List<SseEmitter> dead = new CopyOnWriteArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(
                    SseEmitter.event()
                        .name(eventName)
                        .data(data)
                );
            } catch (IOException e) {
                dead.add(emitter); // client gone
            }
        }

        emitters.removeAll(dead);
    }
}
