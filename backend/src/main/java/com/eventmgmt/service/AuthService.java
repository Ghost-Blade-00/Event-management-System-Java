package com.eventmgmt.service;

import com.eventmgmt.config.JwtUtil;
import com.eventmgmt.dto.*;
import com.eventmgmt.model.User;
import com.eventmgmt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository repo;
    private final PasswordEncoder enc;
    private final JwtUtil jwt;
    private final AuthenticationManager auth;

    public AuthResponse register(RegisterRequest r) {
        if (repo.existsByEmail(r.email)) throw new RuntimeException("Email already registered");
        User u = repo.save(User.builder()
            .firstName(r.firstName).lastName(r.lastName)
            .email(r.email).password(enc.encode(r.password))
            .phone(r.phone).organization(r.organization)
            .role(User.Role.PARTICIPANT).build());
        return toResponse(u);
    }

    public AuthResponse login(LoginRequest r) {
        auth.authenticate(new UsernamePasswordAuthenticationToken(r.email, r.password));
        User u = repo.findByEmail(r.email).orElseThrow();
        return toResponse(u);
    }

    private AuthResponse toResponse(User u) {
        return new AuthResponse(jwt.generate(u.getEmail()),
            u.getId(), u.getEmail(), u.getFullName(), u.getInitials(), u.getRole().name());
    }
}
