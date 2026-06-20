package com.eventmgmt.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id private String id;

    @NonNull private String firstName;
    @NonNull private String lastName;

    @Indexed(unique = true)
    @NonNull private String email;

    @NonNull private String password;

    private String phone;
    private String organization;

    @Builder.Default
    private Role role = Role.PARTICIPANT;

    @Builder.Default
    private boolean enabled = true;

    @CreatedDate private LocalDateTime createdAt;

    public String getFullName() { return firstName + " " + lastName; }

    public String getInitials() {
        return (firstName.isEmpty() ? "?" : String.valueOf(firstName.charAt(0))).toUpperCase()
             + (lastName.isEmpty()  ? "?" : String.valueOf(lastName.charAt(0))).toUpperCase();
    }

    public enum Role { ADMIN, ORGANIZER, PARTICIPANT }
}
