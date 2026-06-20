package com.eventmgmt.dto;
import com.eventmgmt.model.Registration.RegistrationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data public class RegistrationResponse {
    public String id;
    public String eventId;
    public String eventTitle;
    public LocalDateTime eventStartDateTime;
    public String userId;
    public String userName;
    public String userEmail;
    public RegistrationStatus status;
    public String ticketCode;
    public Integer waitlistPosition;
    public LocalDateTime registeredAt;
    public LocalDateTime checkedInAt;
    public boolean checkedIn;
}
