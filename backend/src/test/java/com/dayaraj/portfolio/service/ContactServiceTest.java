package com.dayaraj.portfolio.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.dayaraj.portfolio.dto.ContactRequest;
import com.dayaraj.portfolio.entity.ContactMessage;
import com.dayaraj.portfolio.entity.ContactMessage.EmailStatus;
import com.dayaraj.portfolio.repository.ContactMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;

class ContactServiceTest {

    ContactMessageRepository repo = mock(ContactMessageRepository.class);
    EmailService email = mock(EmailService.class);
    ContactService service = new ContactService(repo, email);
    ContactRequest req = new ContactRequest("  Visitor ", "v@example.com", "Hello there", "A long enough message.");

    @BeforeEach
    void setup() {
        when(repo.save(any())).thenAnswer(inv -> {
            ContactMessage m = inv.getArgument(0);
            if (m.getId() == null) m.setId(42L);
            return m;
        });
    }

    @Test
    void savesTrimmedAndMarksSent() {
        when(email.notifyOwner(any())).thenReturn(EmailStatus.SENT);
        ContactMessage m = service.submit(req);
        assertThat(m.getId()).isEqualTo(42L);
        assertThat(m.getName()).isEqualTo("Visitor");
        assertThat(m.getEmailStatus()).isEqualTo(EmailStatus.SENT);
    }

    @Test
    void emailFailureKeepsSubmission() {
        when(email.notifyOwner(any())).thenReturn(EmailStatus.FAILED);
        ContactMessage m = service.submit(req);
        assertThat(m.getId()).isEqualTo(42L);
        assertThat(m.getEmailStatus()).isEqualTo(EmailStatus.FAILED);
        verify(repo, never()).delete(any());
    }

    @Test
    void persistenceFailurePropagatesAndSkipsEmail() {
        reset(repo);
        when(repo.save(any())).thenThrow(new DataAccessResourceFailureException("down"));
        assertThatThrownBy(() -> service.submit(req)).isInstanceOf(DataAccessResourceFailureException.class);
        verifyNoInteractions(email);
    }
}
