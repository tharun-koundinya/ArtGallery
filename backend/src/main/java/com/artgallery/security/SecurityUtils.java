package com.artgallery.security;

import com.artgallery.common.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Optional<UserPrincipal> getCurrentUserOptional() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            return Optional.empty();
        }
        return Optional.of(principal);
    }

    public static UserPrincipal getCurrentUser() {
        return getCurrentUserOptional()
                .orElseThrow(() -> new BusinessException("Authentication required", HttpStatus.UNAUTHORIZED));
    }

    public static UUID getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
