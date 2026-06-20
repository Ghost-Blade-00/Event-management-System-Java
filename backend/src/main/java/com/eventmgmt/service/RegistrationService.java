package com.eventmgmt.service;

import com.eventmgmt.dto.RegistrationResponse;
import com.eventmgmt.model.*;
import com.eventmgmt.model.Registration.RegistrationStatus;
import com.eventmgmt.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service @RequiredArgsConstructor @Slf4j
public class RegistrationService {
    private final RegistrationRepository regRepo;
    private final EventRepository eventRepo;
    private final UserRepository userRepo;

    public RegistrationResponse register(String eventId, String userId, String notes) {
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        User user  = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (event.getStatus() != Event.EventStatus.PUBLISHED)
            throw new RuntimeException("Event is not open for registration");
        if (regRepo.existsByEventIdAndUserId(eventId, userId))
            throw new RuntimeException("Already registered for this event");

        Registration reg = Registration.builder()
            .eventId(eventId).eventTitle(event.getTitle())
            .eventStartDateTime(event.getStartDateTime())
            .userId(userId).userName(user.getFullName())
            .userEmail(user.getEmail()).userPhone(user.getPhone())
            .notes(notes).build();
        reg.generateTicket();

        if (event.isFull()) {
            int pos = regRepo.findTopByEventIdAndStatusOrderByWaitlistPositionDesc(
                eventId, RegistrationStatus.WAITLISTED)
                .map(r -> r.getWaitlistPosition() != null ? r.getWaitlistPosition() + 1 : 1)
                .orElse(1);
            reg.setStatus(RegistrationStatus.WAITLISTED);
            reg.setWaitlistPosition(pos);
        } else if (event.isRequiresApproval()) {
            reg.setStatus(RegistrationStatus.PENDING);
        } else {
            reg.setStatus(RegistrationStatus.CONFIRMED);
            event.setRegisteredCount(event.getRegisteredCount() + 1);
            eventRepo.save(event);
        }
        return map(regRepo.save(reg));
    }

    public RegistrationResponse checkIn(String ticketCode) {
        Registration reg = regRepo.findByTicketCode(ticketCode)
            .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketCode));
        if (reg.isCheckedIn()) throw new RuntimeException("Already checked in");
        if (reg.getStatus() != RegistrationStatus.CONFIRMED)
            throw new RuntimeException("Registration not confirmed. Status: " + reg.getStatus());
        reg.setCheckedInAt(LocalDateTime.now());
        reg.setStatus(RegistrationStatus.ATTENDED);
        return map(regRepo.save(reg));
    }

    public void cancel(String eventId, String userId) {
        Registration reg = regRepo.findByEventIdAndUserId(eventId, userId)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        boolean wasConfirmed = reg.getStatus() == RegistrationStatus.CONFIRMED;
        reg.setStatus(RegistrationStatus.CANCELLED);
        regRepo.save(reg);
        if (wasConfirmed) {
            eventRepo.findById(eventId).ifPresent(e -> {
                e.setRegisteredCount(Math.max(0, e.getRegisteredCount() - 1));
                eventRepo.save(e);
            });
            promoteWaitlist(eventId);
        }
    }

    public Page<RegistrationResponse> byEvent(String eventId, Pageable p) {
        return regRepo.findByEventId(eventId, p).map(this::map);
    }

    public Page<RegistrationResponse> byUser(String userId, Pageable p) {
        return regRepo.findByUserId(userId, p).map(this::map);
    }

    public record EventStats(int capacity, long confirmed, long waitlisted, long attended, long checkedIn, long available) {}

    public EventStats stats(String eventId) {
        Event e = eventRepo.findById(eventId).orElseThrow();
        return new EventStats(e.getCapacity(),
            regRepo.countByEventIdAndStatus(eventId, RegistrationStatus.CONFIRMED),
            regRepo.countByEventIdAndStatus(eventId, RegistrationStatus.WAITLISTED),
            regRepo.countByEventIdAndStatus(eventId, RegistrationStatus.ATTENDED),
            regRepo.countByEventIdAndCheckedInAtIsNotNull(eventId),
            e.getAvailableSeats());
    }

    private void promoteWaitlist(String eventId) {
        List<Registration> wl = regRepo.findByEventIdAndStatusOrderByWaitlistPositionAsc(
            eventId, RegistrationStatus.WAITLISTED);
        if (!wl.isEmpty()) {
            Registration next = wl.get(0);
            next.setStatus(RegistrationStatus.CONFIRMED);
            next.setWaitlistPosition(null);
            regRepo.save(next);
            eventRepo.findById(eventId).ifPresent(e -> {
                e.setRegisteredCount(e.getRegisteredCount() + 1);
                eventRepo.save(e);
            });
            log.info("Promoted {} from waitlist for event {}", next.getId(), eventId);
        }
    }

    public RegistrationResponse map(Registration r) {
        var res = new RegistrationResponse();
        res.id = r.getId(); res.eventId = r.getEventId(); res.eventTitle = r.getEventTitle();
        res.eventStartDateTime = r.getEventStartDateTime();
        res.userId = r.getUserId(); res.userName = r.getUserName(); res.userEmail = r.getUserEmail();
        res.status = r.getStatus(); res.ticketCode = r.getTicketCode();
        res.waitlistPosition = r.getWaitlistPosition();
        res.registeredAt = r.getRegisteredAt(); res.checkedInAt = r.getCheckedInAt();
        res.checkedIn = r.isCheckedIn();
        return res;
    }
}
