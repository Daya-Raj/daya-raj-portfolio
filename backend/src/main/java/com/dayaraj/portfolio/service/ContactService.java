package com.dayaraj.portfolio.service;

import com.dayaraj.portfolio.dto.ContactRequestDTO;
import com.dayaraj.portfolio.entity.ContactMessage;
import com.dayaraj.portfolio.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;

    public ContactService(ContactMessageRepository contactMessageRepository, EmailService emailService) {
        this.contactMessageRepository = contactMessageRepository;
        this.emailService = emailService;
    }

    public void processContactMessage(ContactRequestDTO dto) {
        // Honeypot check: If filled, ignore and don't send an email
        if (dto.getHoneypot() != null && !dto.getHoneypot().trim().isEmpty()) {
            return;
        }

        ContactMessage entity = new ContactMessage(
                dto.getName(),
                dto.getEmail(),
                dto.getSubject(),
                dto.getMessage()
        );

        contactMessageRepository.save(entity);

        // Send email alert to your personal inbox
        emailService.sendContactNotification(
                dto.getName(),
                dto.getEmail(),
                dto.getSubject(),
                dto.getMessage()
        );
    }
}