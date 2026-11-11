package com.dayaraj.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactRequestDTO {

    @NotBlank(message = "Name cannot be empty")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email cannot be empty")
    @Email(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Please provide a valid email address")
    private String email;

    @Size(max = 200, message = "Subject cannot exceed 200 characters")
    private String subject;

    @NotBlank(message = "Message cannot be empty")
    @Size(min = 10, max = 3000, message = "Message must be between 10 and 3000 characters")
    private String message;

    // Honeypot field: invisible to human users in the UI, used to catch automated spam bots
    private String honeypot;

    // Default constructor (required by Jackson to deserialize JSON into this Java object)
    public ContactRequestDTO() {}

    public ContactRequestDTO(String name, String email, String subject, String message, String honeypot) {
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
        this.honeypot = honeypot;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getHoneypot() { return honeypot; }
    public void setHoneypot(String honeypot) { this.honeypot = honeypot; }
}