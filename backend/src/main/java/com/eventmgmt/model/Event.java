package com.eventmgmt.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.*;

@Document(collection = "events")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Event {
    @Id private String id;

    @NonNull private String title;
    private String description;

    @NonNull private LocalDateTime startDateTime;
    @NonNull private LocalDateTime endDateTime;

    @NonNull private String venue;
    private String venueAddress;

    private int capacity;

    @Builder.Default
    private EventStatus status = EventStatus.DRAFT;

    private EventCategory category;
    private String imageUrl;

    @Builder.Default
    private boolean isPublic = true;
    private boolean requiresApproval;

    // Denormalized organizer info
    private String organizerId;
    private String organizerName;

    // Embedded sessions (no separate collection needed)
    @Builder.Default
    private List<Session> sessions = new ArrayList<>();

    // Maintained counter (updated on register/cancel)
    @Builder.Default
    private int registeredCount = 0;

    @CreatedDate  private LocalDateTime createdAt;
    @LastModifiedDate private LocalDateTime updatedAt;

    public int getAvailableSeats()  { return Math.max(0, capacity - registeredCount); }
    public boolean isFull()         { return getAvailableSeats() == 0; }
    public double getFillPercent()  { return capacity == 0 ? 0 : (registeredCount * 100.0 / capacity); }

    public enum EventStatus   { DRAFT, PUBLISHED, CANCELLED, COMPLETED }
    public enum EventCategory { CONFERENCE, WORKSHOP, SEMINAR, NETWORKING, WEBINAR, TRAINING, OTHER }
}
