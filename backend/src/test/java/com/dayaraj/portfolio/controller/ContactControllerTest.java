package com.dayaraj.portfolio.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dayaraj.portfolio.config.AbuseProtectionFilter;
import com.dayaraj.portfolio.config.CorsConfig;
import com.dayaraj.portfolio.entity.ContactMessage;
import com.dayaraj.portfolio.entity.ContactMessage.EmailStatus;
import com.dayaraj.portfolio.service.ContactService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ContactController.class)
@Import({CorsConfig.class, AbuseProtectionFilter.class, com.dayaraj.portfolio.exception.GlobalExceptionHandler.class})
@TestPropertySource(properties = {
        "app.cors.allowed-origins=http://localhost:8080",
        "app.rate-limit.max-requests=100",
        "app.rate-limit.window-seconds=60",
        "app.request.max-bytes=16384"
})
class ContactControllerTest {

    @Autowired MockMvc mvc;
    @MockBean ContactService service;

    static final String VALID = """
            {"name":"Example Visitor","email":"visitor@example.com",
             "subject":"Project collaboration","message":"I would like to discuss a collaboration."}""";

    private ContactMessage saved(EmailStatus s) {
        ContactMessage m = new ContactMessage("Example Visitor", "visitor@example.com", "Project collaboration", "msg msg msg");
        m.setId(123L);
        m.setEmailStatus(s);
        return m;
    }

    @Test
    void createsSubmission() throws Exception {
        when(service.submit(any())).thenReturn(saved(EmailStatus.SENT));
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(VALID))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.referenceId").value("123"))
                .andExpect(jsonPath("$.message").value("Your message has been received."));
    }

    @Test
    void reportsEmailFailureHonestly() throws Exception {
        when(service.submit(any())).thenReturn(saved(EmailStatus.FAILED));
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(VALID))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.emailStatus").value("FAILED"));
    }

    @Test
    void rejectsInvalidFields() throws Exception {
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\" \",\"email\":\"bad\",\"subject\":\"hi\",\"message\":\"short\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.subject").exists())
                .andExpect(jsonPath("$.errors.message").exists());
        verifyNoInteractions(service);
    }

    @Test
    void persistenceFailureIsNotSuccess() throws Exception {
        when(service.submit(any())).thenThrow(new DataAccessResourceFailureException("db down"));
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(VALID))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void healthIsUp() throws Exception {
        mvc.perform(get("/api/health")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("UP"));
    }
}
