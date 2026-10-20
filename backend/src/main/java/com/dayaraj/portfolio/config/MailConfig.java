package com.dayaraj.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/** Mail settings used by EmailService. JavaMailSender itself is auto-configured by Spring Boot. */
@Configuration
public class MailConfig {

    private final String host;
    private final String from;
    private final String owner;

    public MailConfig(@Value("${spring.mail.host:}") String host,
                      @Value("${app.mail.from:}") String from,
                      @Value("${app.mail.owner:}") String owner) {
        this.host = host;
        this.from = from;
        this.owner = owner;
    }

    public String getFrom() { return from; }
    public String getOwner() { return owner; }

    /** True only when every value needed to actually deliver mail is present. */
    public boolean isConfigured() {
        return !host.isBlank() && !from.isBlank() && !owner.isBlank();
    }
}
