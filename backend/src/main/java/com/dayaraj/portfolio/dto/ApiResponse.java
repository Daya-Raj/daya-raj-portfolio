package com.dayaraj.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse(
        boolean success,
        String message,
        String referenceId,
        String emailStatus,
        Map<String, String> errors) {

    public static ApiResponse ok(String message, String referenceId, String emailStatus) {
        return new ApiResponse(true, message, referenceId, emailStatus, null);
    }

    public static ApiResponse error(String message) {
        return new ApiResponse(false, message, null, null, null);
    }

    public static ApiResponse validation(Map<String, String> errors) {
        return new ApiResponse(false, "Please fix the highlighted fields.", null, null, errors);
    }
}
