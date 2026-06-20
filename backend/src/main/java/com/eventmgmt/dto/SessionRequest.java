package com.eventmgmt.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;
@Data public class SessionRequest {
    @NotBlank public String title;
    public String description;
    public LocalDateTime startTime;
    public LocalDateTime endTime;
    public String room;
    public String speakerName;
    public String type;
}
