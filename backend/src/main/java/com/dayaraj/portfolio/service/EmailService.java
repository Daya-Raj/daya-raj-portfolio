package com.dayaraj.portfolio.service;

import com.dayaraj.portfolio.config.MailConfig;
import com.dayaraj.portfolio.entity.ContactMessage;
import com.dayaraj.portfolio.entity.ContactMessage.EmailStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/** Sends the owner notification as plain text, so visitor content is never interpreted as HTML. */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final ObjectProvider<JavaMailSender> mailSender;
    private final MailConfig config;

    public EmailService(ObjectProvider<JavaMailSender> mailSender, MailConfig config) {
        this.mailSender = mailSender;
        this.config = config;
    }

    public EmailStatus notifyOwner(ContactMessage m) {
        JavaMailSender sender = mailSender.getIfAvailable();
        if (!config.isConfigured() || sender == null) {
            log.warn("SMTP not configured; submission {} saved without notification", m.getId());
            return EmailStatus.NOT_CONFIGURED;
        }
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(config.getFrom());          // verified SMTP sender, never the visitor
        mail.setTo(config.getOwner());
        mail.setReplyTo(m.getEmail());           // visitor goes in Reply-To only
        mail.setSubject("[Portfolio] " + oneLine(m.getSubject()));
        mail.setText("""
                New contact submission #%d

                Name:    %s
                Email:   %s
                Subject: %s

                %s
                """.formatted(m.getId(), oneLine(m.getName()), m.getEmail(), oneLine(m.getSubject()), m.getMessage()));
        try {
            sender.send(mail);
            return EmailStatus.SENT;
        } catch (MailException e) {
            log.error("Notification email failed for submission {}: {}", m.getId(), e.getClass().getSimpleName());
            return EmailStatus.FAILED;
        }
    }

    /** Strip CR/LF so user text can't inject mail headers. */
    private static String oneLine(String s) {
        return s.replaceAll("[\\r\\n]+", " ");
    }
}
