package com.dayaraj.portfolio.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Clock;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Basic abuse protection for POST /api/contact: request-size cap plus a
 * sliding-window rate limit per client IP. State is in memory, so it applies
 * per instance; use a shared store (e.g. Redis) or a gateway/WAF when running
 * several instances.
 */
@Component
public class AbuseProtectionFilter extends OncePerRequestFilter {

    private final int maxRequests;
    private final long windowMillis;
    private final long maxBytes;
    private final Clock clock;
    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    public AbuseProtectionFilter(@Value("${app.rate-limit.max-requests}") int maxRequests,
                                 @Value("${app.rate-limit.window-seconds}") long windowSeconds,
                                 @Value("${app.request.max-bytes}") long maxBytes) {
        this.maxRequests = maxRequests;
        this.windowMillis = windowSeconds * 1000;
        this.maxBytes = maxBytes;
        this.clock = Clock.systemUTC();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest req) {
        return !("POST".equals(req.getMethod()) && "/api/contact".equals(req.getRequestURI()));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        long len = req.getContentLengthLong();
        if (len > maxBytes) {
            write(res, 413, "Request is too large.");
            return;
        }
        String ip = req.getRemoteAddr();
        long now = clock.millis();
        Deque<Long> q = hits.computeIfAbsent(ip, k -> new ArrayDeque<>());
        synchronized (q) {
            while (!q.isEmpty() && now - q.peekFirst() > windowMillis) q.pollFirst();
            if (q.size() >= maxRequests) {
                res.setHeader("Retry-After", String.valueOf(windowMillis / 1000));
                write(res, 429, "Too many messages. Please try again later.");
                return;
            }
            q.addLast(now);
        }
        chain.doFilter(req, res);
    }

    private static void write(HttpServletResponse res, int status, String msg) throws IOException {
        res.setStatus(status);
        res.setContentType("application/json");
        res.getWriter().write("{\"success\":false,\"message\":\"" + msg + "\"}");
    }
}
