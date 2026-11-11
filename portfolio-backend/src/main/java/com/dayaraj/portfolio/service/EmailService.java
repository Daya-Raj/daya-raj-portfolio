package com.dayaraj.portfolio.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${portfolio.admin.email:default@example.com}")
    private String adminEmail;

    @Value("${spring.mail.username:default@example.com}")
    private String fromEmail;
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendContactNotification(String senderName, String senderEmail, String subject, String messageText) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromEmail);
            mail.setTo(adminEmail);
            mail.setReplyTo(senderEmail); // Allows you to hit 'Reply' in your email client directly to the visitor
            mail.setSubject("New Portfolio Message: " + (subject != null ? subject : "No Subject"));

            String body = String.format(
                    "You received a new message from your portfolio contact form:\n\n" +
                            "Name: %s\n" +
                            "Email: %s\n" +
                            "Subject: %s\n\n" +
                            "Message:\n%s\n",
                    senderName, senderEmail, subject, messageText
            );

            mail.setText(body);
            mailSender.send(mail);
        } catch (Exception e) {
            // Log the error so email failures don't crash the user response or roll back DB save
            System.err.println("Failed to dispatch email alert: " + e.getMessage());
        }
    }
}