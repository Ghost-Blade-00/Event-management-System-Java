package com.eventmgmt.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class LoginRequest {
    @Email @NotBlank public String email;
    @NotBlank public String password;
}
