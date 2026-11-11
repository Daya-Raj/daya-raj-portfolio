package com.dayaraj.portfolio.controller;

import com.dayaraj.portfolio.dto.ContactRequestDTO;
import com.dayaraj.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:8080")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<?> submitContactForm(@Valid @RequestBody ContactRequestDTO request) {
        contactService.processContactMessage(request);
        return new ResponseEntity<>(Map.of("message", "Your message has been sent successfully!"), HttpStatus.CREATED);
    }
}