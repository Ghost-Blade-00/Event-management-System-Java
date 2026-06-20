package com.eventmgmt.service;

import com.eventmgmt.dto.*;
import com.eventmgmt.model.*;
import com.eventmgmt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepo;
    private final UserRepository userRepo;
    private final RegistrationRepository regRepo;

    public EventResponse create(EventRequest r, String organizerId) {
        User org = userRepo.findById(organizerId).orElseThrow(() -> new RuntimeException("User not found"));
        Event e = Event.builder()
            .title(r.title).description(r.description)
            .startDateTime(r.startDateTime).endDateTime(r.endDateTime)
            .venue(r.venue).venueAddress(r.venueAddress).capacity(r.capacity)
            .category(r.category).imageUrl(r.imageUrl).isPublic(r.isPublic).requiresApproval(r.requiresApproval)
            .status(Event.EventStatus.DRAFT)
            .organizerId(org.getId()).organizerName(org.getFullName()).build();
        return map(eventRepo.save(e));
    }

    public EventResponse get(String id) { return map(find(id)); }

    public Page<EventResponse> listPublished(String search, Pageable p) {
        return (search != null && !search.isBlank())
            ? eventRepo.searchPublished(search, p).map(this::map)
            : eventRepo.findByStatusAndIsPublicTrue(Event.EventStatus.PUBLISHED, p).map(this::map);
    }

    public Page<EventResponse> listByOrganizer(String orgId, Pageable p) {
        return eventRepo.findByOrganizerId(orgId, p).map(this::map);
    }

    public EventResponse update(String id, EventRequest r, String userId) {
        Event e = find(id); checkOwner(e, userId);
        e.setTitle(r.title); e.setDescription(r.description);
        e.setStartDateTime(r.startDateTime); e.setEndDateTime(r.endDateTime);
        e.setVenue(r.venue); e.setVenueAddress(r.venueAddress);
        e.setCapacity(r.capacity); e.setCategory(r.category); e.setImageUrl(r.imageUrl);
        e.setPublic(r.isPublic); e.setRequiresApproval(r.requiresApproval);
        return map(eventRepo.save(e));
    }

    public EventResponse publish(String id, String userId) {
        Event e = find(id); checkOwner(e, userId);
        e.setStatus(Event.EventStatus.PUBLISHED);
        return map(eventRepo.save(e));
    }

    public EventResponse cancel(String id, String userId) {
        Event e = find(id); checkOwner(e, userId);
        e.setStatus(Event.EventStatus.CANCELLED);
        return map(eventRepo.save(e));
    }

    public void delete(String id, String userId) {
        Event e = find(id); checkOwner(e, userId);
        eventRepo.delete(e);
    }

    public EventResponse addSession(String eventId, SessionRequest r, String userId) {
        Event e = find(eventId); checkOwner(e, userId);
        Session s = Session.builder()
            .id(UUID.randomUUID().toString()).title(r.title).description(r.description)
            .startTime(r.startTime).endTime(r.endTime).room(r.room).speakerName(r.speakerName)
            .type(r.type != null ? Session.SessionType.valueOf(r.type) : Session.SessionType.TALK)
            .build();
        e.getSessions().add(s);
        return map(eventRepo.save(e));
    }

    public DashboardResponse dashboard() {
        DashboardResponse d = new DashboardResponse();
        d.totalEvents = eventRepo.count();
        d.publishedEvents = eventRepo.countByStatus(Event.EventStatus.PUBLISHED);
        LocalDateTime now = LocalDateTime.now();
        d.upcomingEvents = eventRepo.findByStatusAndStartDateTimeBetween(
            Event.EventStatus.PUBLISHED, now, now.plusDays(30)).size();
        d.totalRegistrations = regRepo.count();
        d.totalUsers = userRepo.count();
        d.avgFillRate = eventRepo.findAll().stream()
            .filter(e -> e.getCapacity() > 0)
            .mapToDouble(Event::getFillPercent).average().orElse(0);
        return d;
    }

    // ── internals ──────────────────────────────────────────────────────────────
    Event find(String id) {
        return eventRepo.findById(id).orElseThrow(() -> new RuntimeException("Event not found: " + id));
    }

    void checkOwner(Event e, String userId) {
        userRepo.findById(userId).ifPresent(u -> {
            if (u.getRole() != User.Role.ADMIN && !userId.equals(e.getOrganizerId()))
                throw new RuntimeException("Access denied");
        });
    }

    public EventResponse map(Event e) {
        EventResponse r = new EventResponse();
        r.id = e.getId(); r.title = e.getTitle(); r.description = e.getDescription();
        r.startDateTime = e.getStartDateTime(); r.endDateTime = e.getEndDateTime();
        r.venue = e.getVenue(); r.venueAddress = e.getVenueAddress();
        r.capacity = e.getCapacity(); r.registeredCount = e.getRegisteredCount();
        r.availableSeats = e.getAvailableSeats(); r.fillPercent = e.getFillPercent();
        r.status = e.getStatus(); r.category = e.getCategory(); r.imageUrl = e.getImageUrl();
        r.isPublic = e.isPublic(); r.requiresApproval = e.isRequiresApproval();
        r.organizerId = e.getOrganizerId(); r.organizerName = e.getOrganizerName();
        r.createdAt = e.getCreatedAt();
        r.sessions = e.getSessions().stream().map(s -> {
            var sd = new EventResponse.SessionDTO();
            sd.id = s.getId(); sd.title = s.getTitle(); sd.description = s.getDescription();
            sd.room = s.getRoom(); sd.speakerName = s.getSpeakerName();
            sd.type = s.getType() != null ? s.getType().name() : null;
            sd.startTime = s.getStartTime(); sd.endTime = s.getEndTime();
            return sd;
        }).collect(Collectors.toList());
        return r;
    }
}
