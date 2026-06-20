package com.eventmgmt.controller;

import com.eventmgmt.model.ChatMessage;
import com.eventmgmt.repository.ChatMessageRepository;
import com.eventmgmt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatMessageRepository chatRepo;
    private final UserRepository userRepo;

    @PostMapping
    public ChatMessage saveMessage(@RequestBody ChatMessage message, @AuthenticationPrincipal UserDetails ud) {
        if (ud != null) {
            String userId = userRepo.findByEmail(ud.getUsername())
                .map(u -> u.getId()).orElse(null);
            message.setUserId(userId);
        }
        message.setTimestamp(LocalDateTime.now());
        return chatRepo.save(message);
    }

    @GetMapping
    public List<ChatMessage> getHistory(@AuthenticationPrincipal UserDetails ud) {
        if (ud == null) {
            return List.of();
        }
        String userId = userRepo.findByEmail(ud.getUsername())
            .map(u -> u.getId()).orElse(null);
        if (userId == null) {
            return List.of();
        }
        return chatRepo.findByUserIdOrderByTimestampAsc(userId);
    }
}
