package com.eventmgmt.repository;

import com.eventmgmt.model.Registration;
import com.eventmgmt.model.Registration.RegistrationStatus;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.*;

public interface RegistrationRepository extends MongoRepository<Registration, String> {
    Optional<Registration> findByEventIdAndUserId(String eventId, String userId);
    boolean existsByEventIdAndUserId(String eventId, String userId);

    Page<Registration> findByEventId(String eventId, Pageable p);
    Page<Registration> findByUserId(String userId, Pageable p);

    List<Registration> findByEventIdAndStatusOrderByWaitlistPositionAsc(String eventId, RegistrationStatus s);
    List<Registration> findByEventIdAndStatus(String eventId, RegistrationStatus s);

    long countByEventIdAndStatus(String eventId, RegistrationStatus s);
    long countByEventIdAndCheckedInAtIsNotNull(String eventId);

    Optional<Registration> findTopByEventIdAndStatusOrderByWaitlistPositionDesc(String eventId, RegistrationStatus s);
    Optional<Registration> findByTicketCode(String ticketCode);
}
