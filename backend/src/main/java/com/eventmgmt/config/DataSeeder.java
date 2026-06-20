package com.eventmgmt.config;

import com.eventmgmt.model.*;
import com.eventmgmt.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@Component @RequiredArgsConstructor @Slf4j
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepo;
    private final EventRepository eventRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) { log.info("DB already seeded."); return; }
        log.info("Seeding MongoDB Atlas with sample data...");

        User admin = userRepo.save(User.builder()
            .firstName("Admin").lastName("User").email("admin@demo.com")
            .password(encoder.encode("admin123")).role(User.Role.ADMIN).build());

        User org = userRepo.save(User.builder()
            .firstName("Rajesh").lastName("Verma").email("organizer@demo.com")
            .password(encoder.encode("pass123")).organization("TechEvents India")
            .role(User.Role.ORGANIZER).build());

        userRepo.save(User.builder()
            .firstName("Priya").lastName("Sharma").email("user@demo.com")
            .password(encoder.encode("pass123")).phone("+91-9876543210")
            .role(User.Role.PARTICIPANT).build());

        // Event 1 – Conference
        Event e1 = Event.builder()
            .title("Annual Tech Summit 2026")
            .description("India's largest technology conference covering AI, Cloud & DevOps. Network with 500+ industry professionals.")
            .startDateTime(LocalDateTime.now().plusDays(5))
            .endDateTime(LocalDateTime.now().plusDays(5).plusHours(8))
            .venue("Convention Center, Hall A").venueAddress("Sector 17, Chandigarh")
            .capacity(200).status(Event.EventStatus.PUBLISHED)
            .category(Event.EventCategory.CONFERENCE)
            .organizerId(org.getId()).organizerName(org.getFullName())
            .isPublic(true).build();
        e1.getSessions().add(Session.builder()
            .id(UUID.randomUUID().toString()).title("Keynote: Future of AI")
            .startTime(e1.getStartDateTime()).endTime(e1.getStartDateTime().plusHours(1))
            .room("Main Stage").speakerName("Dr. Anjali Singh").type(Session.SessionType.KEYNOTE).build());
        e1.getSessions().add(Session.builder()
            .id(UUID.randomUUID().toString()).title("Workshop: Building with LLMs")
            .startTime(e1.getStartDateTime().plusHours(2)).endTime(e1.getStartDateTime().plusHours(4))
            .room("Room B2").speakerName("Nikhil Mehta").type(Session.SessionType.WORKSHOP).build());
        e1.getSessions().add(Session.builder()
            .id(UUID.randomUUID().toString()).title("Panel: Cloud Security in 2026")
            .startTime(e1.getStartDateTime().plusHours(5)).endTime(e1.getStartDateTime().plusHours(6))
            .room("Room A1").speakerName("Multiple Speakers").type(Session.SessionType.PANEL).build());
        eventRepo.save(e1);

        // Event 2 – Workshop
        eventRepo.save(Event.builder()
            .title("Leadership Excellence Workshop")
            .description("Intensive one-day workshop on modern leadership, communication, and people management.")
            .startDateTime(LocalDateTime.now().plusDays(10))
            .endDateTime(LocalDateTime.now().plusDays(10).plusHours(6))
            .venue("Business Hub, Room 3").venueAddress("Phase 8, Mohali")
            .capacity(40).status(Event.EventStatus.PUBLISHED)
            .category(Event.EventCategory.WORKSHOP)
            .organizerId(org.getId()).organizerName(org.getFullName()).isPublic(true).build());

        // Event 3 – Networking
        eventRepo.save(Event.builder()
            .title("Startup Networking Mixer")
            .description("Connect with founders, investors, and startup enthusiasts over drinks and conversations.")
            .startDateTime(LocalDateTime.now().plusDays(20))
            .endDateTime(LocalDateTime.now().plusDays(20).plusHours(3))
            .venue("Terrace Lounge, The Grand Hotel").venueAddress("Sector 8, Chandigarh")
            .capacity(80).status(Event.EventStatus.PUBLISHED)
            .category(Event.EventCategory.NETWORKING)
            .organizerId(org.getId()).organizerName(org.getFullName()).isPublic(true).build());

        // Event 4 – Webinar (Draft)
        eventRepo.save(Event.builder()
            .title("Introduction to Kubernetes")
            .description("A beginner-friendly webinar on container orchestration with Kubernetes.")
            .startDateTime(LocalDateTime.now().plusDays(3))
            .endDateTime(LocalDateTime.now().plusDays(3).plusHours(2))
            .venue("Online – Zoom").capacity(500)
            .status(Event.EventStatus.DRAFT)
            .category(Event.EventCategory.WEBINAR)
            .organizerId(org.getId()).organizerName(org.getFullName()).isPublic(true).build());

        log.info("Seeded: 3 users, 4 events");
        log.info("Logins → admin@demo.com/admin123  organizer@demo.com/pass123  user@demo.com/pass123");
    }
}

@RestControllerAdvice @Slf4j
class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,Object>> handleRuntime(RuntimeException ex) {
        log.warn("Error: {}", ex.getMessage());
        HttpStatus status = ex.getMessage() != null && ex.getMessage().contains("not found")
            ? HttpStatus.NOT_FOUND
            : ex.getMessage() != null && (ex.getMessage().contains("already") || ex.getMessage().contains("duplicate"))
            ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(Map.of("error", ex.getMessage(), "status", status.value()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String,String> errs = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors())
            errs.put(fe.getField(), fe.getDefaultMessage());
        return ResponseEntity.badRequest().body(Map.of("error", "Validation failed", "fields", errs));
    }
}
