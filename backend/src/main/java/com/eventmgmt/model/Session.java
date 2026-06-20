package com.eventmgmt.model;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Session {
    private String id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String room;
    private String speakerName;
    @Builder.Default
    private SessionType type = SessionType.TALK;

    public enum SessionType { KEYNOTE, TALK, WORKSHOP, PANEL, BREAK, NETWORKING }
}
