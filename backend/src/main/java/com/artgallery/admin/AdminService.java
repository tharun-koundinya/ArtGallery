package com.artgallery.admin;

import com.artgallery.admin.dto.DashboardStatsResponse;
import com.artgallery.admin.dto.RejectRequest;
import com.artgallery.artist.ArtistService;
import com.artgallery.artist.dto.ArtistApplicationResponse;
import com.artgallery.artwork.ArtworkService;
import com.artgallery.artwork.dto.ArtworkResponse;
import com.artgallery.auth.AuthService;
import com.artgallery.auth.dto.UserResponse;
import com.artgallery.common.PageResponse;
import com.artgallery.common.exception.BusinessException;
import com.artgallery.common.exception.ResourceNotFoundException;
import com.artgallery.domain.entity.ArtistApplication;
import com.artgallery.domain.entity.ArtistProfile;
import com.artgallery.domain.entity.AuditLog;
import com.artgallery.domain.entity.Role;
import com.artgallery.domain.entity.User;
import com.artgallery.domain.enums.ApplicationStatus;
import com.artgallery.domain.enums.ArtistStatus;
import com.artgallery.domain.enums.ArtworkStatus;
import com.artgallery.domain.enums.RoleName;
import com.artgallery.repository.ArtistApplicationRepository;
import com.artgallery.repository.ArtistProfileRepository;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.AuditLogRepository;
import com.artgallery.repository.RoleRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ArtistApplicationRepository artistApplicationRepository;
    private final ArtistProfileRepository artistProfileRepository;
    private final ArtworkRepository artworkRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditLogRepository auditLogRepository;
    private final ArtworkService artworkService;
    private final ArtistService artistService;

    @Transactional(readOnly = true)
    public List<ArtistApplicationResponse> listApplications(ApplicationStatus status) {
        List<ArtistApplication> apps = status == null
                ? artistApplicationRepository.findAllByOrderByCreatedAtDesc()
                : artistApplicationRepository.findByStatus(status);

        return apps.stream().map(app -> {
            String displayName = artistProfileRepository.findByUserId(app.getUser().getId())
                    .map(ArtistProfile::getDisplayName)
                    .orElse(app.getUser().getFullName());
            return artistService.toApplicationResponse(app, displayName, app.getUser().getEmail());
        }).toList();
    }

    @Transactional
    public ArtistApplicationResponse approveApplication(UUID id, UserPrincipal principal, HttpServletRequest request) {
        ArtistApplication application = artistApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new BusinessException("Application is not pending", HttpStatus.CONFLICT);
        }

        User reviewer = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getId()));
        User applicant = application.getUser();

        application.setStatus(ApplicationStatus.APPROVED);
        application.setReviewedBy(reviewer);
        application.setReviewedAt(Instant.now());
        application.setRejectionReason(null);

        ArtistProfile profile = artistProfileRepository.findByUserId(applicant.getId())
                .orElseThrow(() -> new BusinessException("Artist profile missing for applicant"));
        String oldStatus = profile.getStatus().name();
        profile.setStatus(ArtistStatus.APPROVED);
        profile.setApprovedAt(Instant.now());
        profile.setRejectionReason(null);

        Role artistRole = roleRepository.findByName(RoleName.ROLE_ARTIST)
                .orElseThrow(() -> new BusinessException("ROLE_ARTIST not seeded"));
        applicant.getRoles().add(artistRole);

        auditLogRepository.save(AuditLog.builder()
                .actor(reviewer)
                .action("ARTIST_APPLICATION_APPROVED")
                .entityType("ArtistApplication")
                .entityId(application.getId())
                .oldValue(oldStatus)
                .newValue(ArtistStatus.APPROVED.name())
                .ip(request.getRemoteAddr())
                .build());

        return artistService.toApplicationResponse(application, profile.getDisplayName(), applicant.getEmail());
    }

    @Transactional
    public ArtistApplicationResponse rejectApplication(
            UUID id,
            RejectRequest rejectRequest,
            UserPrincipal principal,
            HttpServletRequest request
    ) {
        ArtistApplication application = artistApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new BusinessException("Application is not pending", HttpStatus.CONFLICT);
        }

        User reviewer = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getId()));

        application.setStatus(ApplicationStatus.REJECTED);
        application.setRejectionReason(rejectRequest.getReason());
        application.setReviewedBy(reviewer);
        application.setReviewedAt(Instant.now());

        ArtistProfile profile = artistProfileRepository.findByUserId(application.getUser().getId()).orElse(null);
        if (profile != null) {
            profile.setStatus(ArtistStatus.REJECTED);
            profile.setRejectionReason(rejectRequest.getReason());
        }

        auditLogRepository.save(AuditLog.builder()
                .actor(reviewer)
                .action("ARTIST_APPLICATION_REJECTED")
                .entityType("ArtistApplication")
                .entityId(application.getId())
                .oldValue(ApplicationStatus.PENDING.name())
                .newValue(ApplicationStatus.REJECTED.name() + ": " + rejectRequest.getReason())
                .ip(request.getRemoteAddr())
                .build());

        String displayName = profile != null ? profile.getDisplayName() : application.getUser().getFullName();
        return artistService.toApplicationResponse(application, displayName, application.getUser().getEmail());
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse dashboardStats() {
        return DashboardStatsResponse.builder()
                .users(userRepository.count())
                .artists(artistProfileRepository.countByStatus(ArtistStatus.APPROVED))
                .artworks(artworkRepository.count())
                .publishedArtworks(artworkRepository.countByStatus(ArtworkStatus.PUBLISHED))
                .pendingApplications(artistApplicationRepository.countByStatus(ApplicationStatus.PENDING))
                .pendingArtworks(artworkRepository.countByStatus(ArtworkStatus.PENDING_REVIEW))
                .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<ArtworkResponse> listArtworks(ArtworkStatus status, int page, int size) {
        return artworkService.adminList(status, page, size);
    }

    @Transactional
    public ArtworkResponse publishArtwork(UUID id, UserPrincipal principal, HttpServletRequest request) {
        ArtworkResponse response = artworkService.publish(id);
        User actor = userRepository.findById(principal.getId()).orElse(null);
        auditLogRepository.save(AuditLog.builder()
                .actor(actor)
                .action("ARTWORK_PUBLISHED")
                .entityType("Artwork")
                .entityId(id)
                .newValue(ArtworkStatus.PUBLISHED.name())
                .ip(request.getRemoteAddr())
                .build());
        return response;
    }

    @Transactional
    public ArtworkResponse rejectArtwork(UUID id, RejectRequest rejectRequest, UserPrincipal principal, HttpServletRequest request) {
        ArtworkResponse response = artworkService.reject(id, rejectRequest.getReason());
        User actor = userRepository.findById(principal.getId()).orElse(null);
        auditLogRepository.save(AuditLog.builder()
                .actor(actor)
                .action("ARTWORK_REJECTED")
                .entityType("Artwork")
                .entityId(id)
                .newValue(rejectRequest.getReason())
                .ip(request.getRemoteAddr())
                .build());
        return response;
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> listUsers(int page, int size) {
        Page<UserResponse> users = userRepository.findAll(PageRequest.of(page, Math.min(size, 50)))
                .map(AuthService::toUserResponse);
        return PageResponse.from(users);
    }
}
