package com.eventmgmt.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "chats")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ChatMessage {
    @Id private String id;
    private String userId;
    private String sender; // "USER" or "BOT"
    private String text;
    private LocalDateTime timestamp;
}
