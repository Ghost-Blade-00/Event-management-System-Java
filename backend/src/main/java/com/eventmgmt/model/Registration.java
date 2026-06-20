package com.eventmgmt.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "registrations")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@CompoundIndexes({
    @CompoundIndex(name = "event_user_unique", def = "{'eventId':1,'userId':1}", unique = true)
})
public class Registration {
    @Id private String id;

    @Indexed private String eventId;
    private String eventTitle;
    private LocalDateTime eventStartDateTime;

    @Indexed private String userId;
    private String userName;
    private String userEmail;
    private String userPhone;

    @Builder.Default
    private RegistrationStatus status = RegistrationStatus.PENDING;

    @Indexed(unique = true, sparse = true)
    private String ticketCode;

    private Integer waitlistPosition;

    @CreatedDate private LocalDateTime registeredAt;
    private LocalDateTime checkedInAt;
    private String notes;

    public boolean isCheckedIn() { return checkedInAt != null; }

    public void generateTicket() {
        if (ticketCode == null) {
            ticketCode = "EVT-" + System.currentTimeMillis() + "-"
                       + String.format("%04d", (int)(Math.random() * 9000 + 1000));
        }
    }

    public enum RegistrationStatus { PENDING, CONFIRMED, WAITLISTED, CANCELLED, ATTENDED, NO_SHOW }
}
