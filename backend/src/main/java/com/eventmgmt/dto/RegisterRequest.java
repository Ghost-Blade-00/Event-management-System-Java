package com.eventmgmt.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class RegisterRequest {
    @NotBlank public String firstName;
    @NotBlank public String lastName;
    @Email @NotBlank public String email;
    @NotBlank @Size(min=6, message="Password must be at least 6 characters") public String password;
    public String phone;
    public String organization;
}
