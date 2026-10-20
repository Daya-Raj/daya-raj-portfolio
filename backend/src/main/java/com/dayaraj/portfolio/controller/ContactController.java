package com.dayaraj.portfolio.controller;

import com.dayaraj.portfolio.dto.ApiResponse;
import com.dayaraj.portfolio.dto.ContactRequest;
import com.dayaraj.portfolio.entity.ContactMessage;
import com.dayaraj.portfolio.service.ContactService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse> submit(@Valid @RequestBody ContactRequest request) {
        ContactMessage saved = contactService.submit(request);
        String ref = String.valueOf(saved.getId());
        String status = saved.getEmailStatus().name();
        String msg = saved.getEmailStatus() == ContactMessage.EmailStatus.SENT
                ? "Your message has been received."
                : "Your message has been saved, but the email notification could not be sent right now.";
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(msg, ref, status));
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
