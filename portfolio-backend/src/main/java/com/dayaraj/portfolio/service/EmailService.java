package com.dayaraj.portfolio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${portfolio.admin.email:default@example.com}")
    private String adminEmail;

    @Value("${RESEND_API_KEY:}")
    private String resendApiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Async
    public void sendContactNotification(String senderName, String senderEmail, String subject, String messageText) {
        try {
            if (resendApiKey == null || resendApiKey.isBlank()) {
                System.err.println("Failed to dispatch email alert: RESEND_API_KEY is not configured.");
                return;
            }

            String emailSubject = "New Portfolio Message: " + (subject != null ? subject : "No Subject");
            String body = String.format(
                    "You received a new message from your portfolio contact form:\n\n" +
                    "Name: %s\n" +
                    "Email: %s\n" +
                    "Subject: %s\n\n" +
                    "Message:\n%s\n",
                    senderName, senderEmail, subject, messageText
            );

            Map<String, Object> payload = Map.of(
                    "from", "Portfolio Contact <onboarding@resend.dev>",
                    "to", List.of(adminEmail),
                    "reply_to", senderEmail,
                    "subject", emailSubject,
                    "text", body
            );

            String jsonBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                System.err.println("Failed to dispatch email alert (HTTP " + response.statusCode() + "): " + response.body());
            } else {
                System.out.println("Email alert dispatched successfully: " + response.body());
            }
        } catch (Exception e) {
            System.err.println("Failed to dispatch email alert: " + e.getMessage());
        }
    }
}
