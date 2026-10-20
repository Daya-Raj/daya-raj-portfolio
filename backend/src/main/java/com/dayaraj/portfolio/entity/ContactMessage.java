package com.dayaraj.portfolio.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "contact_messages", indexes = {
        @Index(name = "idx_contact_created_at", columnList = "created_at"),
        @Index(name = "idx_contact_email_status", columnList = "email_status")
})
public class ContactMessage {

    public enum EmailStatus { PENDING, SENT, FAILED, NOT_CONFIGURED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(nullable = false, length = 150)
    private String subject;

    @Column(nullable = false, length = 5000)
    private String message;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "email_status", nullable = false, length = 20)
    private EmailStatus emailStatus = EmailStatus.PENDING;

    protected ContactMessage() {}

    public ContactMessage(String name, String email, String subject, String message) {
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getSubject() { return subject; }
    public String getMessage() { return message; }
    public Instant getCreatedAt() { return createdAt; }
    public EmailStatus getEmailStatus() { return emailStatus; }
    public void setEmailStatus(EmailStatus emailStatus) { this.emailStatus = emailStatus; }
}
