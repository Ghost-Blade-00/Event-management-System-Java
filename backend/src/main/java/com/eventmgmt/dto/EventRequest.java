package com.eventmgmt.dto;
import com.eventmgmt.model.Event;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data public class EventRequest {
    @NotBlank public String title;
    public String description;
    @NotNull public LocalDateTime startDateTime;
    @NotNull public LocalDateTime endDateTime;
    @NotBlank public String venue;
    public String venueAddress;
    @Min(1) public int capacity;
    public Event.EventCategory category;
    public String imageUrl;
    public boolean isPublic = true;
    public boolean requiresApproval;
}
