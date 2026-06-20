package com.eventmgmt.dto;
import com.eventmgmt.model.Event;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data public class EventResponse {
    public String id;
    public String title;
    public String description;
    public LocalDateTime startDateTime;
    public LocalDateTime endDateTime;
    public String venue;
    public String venueAddress;
    public int capacity;
    public int registeredCount;
    public int availableSeats;
    public double fillPercent;
    public Event.EventStatus status;
    public Event.EventCategory category;
    public String imageUrl;
    public boolean isPublic;
    public boolean requiresApproval;
    public String organizerId;
    public String organizerName;
    public LocalDateTime createdAt;
    public List<SessionDTO> sessions;

    @Data public static class SessionDTO {
        public String id, title, description, room, speakerName, type;
        public LocalDateTime startTime, endTime;
    }
}
