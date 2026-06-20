package com.eventmgmt.controller;

import com.eventmgmt.dto.RegistrationResponse;
import com.eventmgmt.repository.UserRepository;
import com.eventmgmt.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {
    private final RegistrationService svc;
    private final UserRepository users;

    @PostMapping("/events/{eventId}")
    public ResponseEntity<RegistrationResponse> register(@PathVariable String eventId,
            @RequestBody(required=false) Map<String,String> body,
            @AuthenticationPrincipal UserDetails ud) {
        String notes = body != null ? body.get("notes") : null;
        return ResponseEntity.status(201).body(svc.register(eventId, uid(ud), notes));
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> cancel(@PathVariable String eventId,
            @AuthenticationPrincipal UserDetails ud) {
        svc.cancel(eventId, uid(ud)); return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkin")
    public RegistrationResponse checkIn(@RequestBody Map<String,String> body) {
        String code = body.get("ticketCode");
        if (code == null || code.isBlank()) throw new RuntimeException("ticketCode is required");
        return svc.checkIn(code.trim());
    }

    @GetMapping("/mine")
    public Page<RegistrationResponse> mine(@AuthenticationPrincipal UserDetails ud,
            @PageableDefault(size=20) Pageable p) {
        return svc.byUser(uid(ud), p);
    }

    private String uid(UserDetails ud) {
        return users.findByEmail(ud.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}
