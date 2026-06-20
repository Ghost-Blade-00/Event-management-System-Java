package com.eventmgmt.dto;
import lombok.*;
@Data @AllArgsConstructor
public class AuthResponse {
    public String token;
    public String userId;
    public String email;
    public String fullName;
    public String initials;
    public String role;
}
