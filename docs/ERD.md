# MyDocs — Entity Relationship Diagram

```
documents
─────────────────────────────
id             BIGINT PK AUTO_INCREMENT
fileName       VARCHAR NOT NULL
fileType       VARCHAR
fileSize       BIGINT
storagePath    VARCHAR
uploadedBy     VARCHAR
uploadedAt     DATETIME
status         VARCHAR  ("UPLOADED" | "PROCESSING" | "DONE")

notifications
─────────────────────────────
id             BIGINT PK AUTO_INCREMENT
message        VARCHAR
type           VARCHAR  ("SUCCESS" | "ERROR" | "INFO")
read           BOOLEAN DEFAULT FALSE
createdAt      DATETIME

upload_sessions
─────────────────────────────
id             BIGINT PK AUTO_INCREMENT
sessionId      VARCHAR  (UUID sent to frontend for SSE)
fileName       VARCHAR
progressPercent INT
status         VARCHAR  ("IN_PROGRESS" | "DONE" | "FAILED")
startedAt      DATETIME
```

All tables are auto-created by Hibernate on startup (ddl-auto=update).
