package com.dayaraj.portfolio.service;

import com.dayaraj.portfolio.dto.ContactRequest;
import com.dayaraj.portfolio.entity.ContactMessage;
import com.dayaraj.portfolio.entity.ContactMessage.EmailStatus;
import com.dayaraj.portfolio.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

/**
 * Persist first (its own transaction via repository.save), then notify.
 * An email failure only updates the status; the saved submission is never rolled back.
 */
@Service
public class ContactService {

    private final ContactMessageRepository repository;
    private final EmailService emailService;

    public ContactService(ContactMessageRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    public ContactMessage submit(ContactRequest req) {
        ContactMessage saved = repository.save(
                new ContactMessage(req.name(), req.email(), req.subject(), req.message()));

        EmailStatus status = emailService.notifyOwner(saved);
        saved.setEmailStatus(status);
        try {
            return repository.save(saved);
        } catch (RuntimeException e) {
            // Submission already stored; the status update is best-effort.
            return saved;
        }
    }
}
