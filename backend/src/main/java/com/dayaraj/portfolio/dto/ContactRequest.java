package com.dayaraj.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Incoming contact form payload. Values are trimmed by {@link #normalized()} before persistence. */
public record ContactRequest(
        @NotBlank(message = "Please enter your name.")
        @Size(min = 2, max = 100, message = "Name must be 2–100 characters.")
        String name,

        @NotBlank(message = "Please enter your email.")
        @Email(message = "Please enter a valid email.")
        @Size(max = 254, message = "Email must be at most 254 characters.")
        String email,

        @NotBlank(message = "Please add a subject.")
        @Size(min = 3, max = 150, message = "Subject must be 3–150 characters.")
        String subject,

        @NotBlank(message = "Please write a message.")
        @Size(min = 10, max = 5000, message = "Message must be 10–5000 characters.")
        String message) {

    public ContactRequest {
        name = trim(name);
        email = trim(email);
        subject = trim(subject);
        message = trim(message);
    }

    private static String trim(String s) {
        return s == null ? null : s.strip();
    }
}
