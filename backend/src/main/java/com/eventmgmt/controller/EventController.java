package com.eventmgmt.controller;

import com.eventmgmt.dto.*;
import com.eventmgmt.model.Event;
import com.eventmgmt.repository.UserRepository;
import com.eventmgmt.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService svc;
    private final RegistrationService regSvc;
    private final UserRepository users;

    @GetMapping
    public Page<EventResponse> list(
            @RequestParam(required=false) String search,
            @PageableDefault(size=20,sort="startDateTime") Pageable p) {
        return svc.listPublished(search, p);
    }

    @GetMapping("/{id}")
    public EventResponse get(@PathVariable String id) { return svc.get(id); }

    @PostMapping
    public ResponseEntity<EventResponse> create(@Valid @RequestBody EventRequest r,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.status(201).body(svc.create(r, uid(ud)));
    }

    @PutMapping("/{id}")
    public EventResponse update(@PathVariable String id, @Valid @RequestBody EventRequest r,
            @AuthenticationPrincipal UserDetails ud) {
        return svc.update(id, r, uid(ud));
    }

    @PatchMapping("/{id}/publish")
    public EventResponse publish(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        return svc.publish(id, uid(ud));
    }

    @PatchMapping("/{id}/cancel")
    public EventResponse cancel(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        return svc.cancel(id, uid(ud));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        svc.delete(id, uid(ud)); return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/sessions")
    public EventResponse addSession(@PathVariable String id, @Valid @RequestBody SessionRequest r,
            @AuthenticationPrincipal UserDetails ud) {
        return svc.addSession(id, r, uid(ud));
    }

    @GetMapping("/{id}/registrations")
    public Page<RegistrationResponse> registrations(@PathVariable String id,
            @PageableDefault(size=50) Pageable p) {
        return regSvc.byEvent(id, p);
    }

    @GetMapping("/{id}/stats")
    public RegistrationService.EventStats stats(@PathVariable String id) {
        return regSvc.stats(id);
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() { return svc.dashboard(); }

    @GetMapping("/my")
    public Page<EventResponse> my(@AuthenticationPrincipal UserDetails ud,
            @PageableDefault(size=20) Pageable p) {
        return svc.listByOrganizer(uid(ud), p);
    }

    private String uid(UserDetails ud) {
        return users.findByEmail(ud.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}
