package com.eventmgmt.repository;

import com.eventmgmt.model.Event;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {

    Page<Event> findByStatusAndIsPublicTrue(Event.EventStatus status, Pageable p);

    Page<Event> findByOrganizerId(String organizerId, Pageable p);

    @Query("{'status':'PUBLISHED','isPublic':true,$or:[{'title':{$regex:?0,$options:'i'}},{'description':{$regex:?0,$options:'i'}}]}")
    Page<Event> searchPublished(String keyword, Pageable p);

    List<Event> findByStatusAndStartDateTimeBetween(Event.EventStatus status,
        LocalDateTime from, LocalDateTime to);

    long countByStatus(Event.EventStatus status);
}
