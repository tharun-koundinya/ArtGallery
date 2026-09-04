package com.artgallery.artist;

import com.artgallery.artist.dto.ArtistApplyRequest;
import com.artgallery.artist.dto.ArtistApplicationResponse;
import com.artgallery.artist.dto.ArtistProfileUpdateRequest;
import com.artgallery.artist.dto.ArtistResponse;
import com.artgallery.common.exception.BusinessException;
import com.artgallery.common.exception.ResourceNotFoundException;
import com.artgallery.domain.entity.ArtistApplication;
import com.artgallery.domain.entity.ArtistProfile;
import com.artgallery.domain.entity.User;
import com.artgallery.domain.enums.ApplicationStatus;
import com.artgallery.domain.enums.ArtistStatus;
import com.artgallery.repository.ArtistApplicationRepository;
import com.artgallery.repository.ArtistProfileRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final ArtistProfileRepository artistProfileRepository;
    private final ArtistApplicationRepository artistApplicationRepository;
    private final UserRepository userRepository;

    @Transactional
    public ArtistApplicationResponse apply(UserPrincipal principal, ArtistApplyRequest request) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getId()));

        if (artistApplicationRepository.existsByUserIdAndStatus(user.getId(), ApplicationStatus.PENDING)) {
            throw new BusinessException("You already have a pending artist application", HttpStatus.CONFLICT);
        }

        if (artistProfileRepository.existsByUserIdAndStatusIn(user.getId(),
                List.of(ArtistStatus.APPROVED, ArtistStatus.PENDING))) {
            throw new BusinessException("You already have an artist profile pending or approved", HttpStatus.CONFLICT);
        }

        ArtistProfile profile = artistProfileRepository.findByUserId(user.getId()).orElse(null);
        if (profile == null) {
            profile = ArtistProfile.builder()
                    .user(user)
                    .displayName(request.getDisplayName())
                    .bio(request.getBiography())
                    .website(request.getWebsite())
                    .instagram(request.getInstagram())
                    .country(request.getCountry())
                    .yearsExperience(request.getYearsExperience())
                    .status(ArtistStatus.PENDING)
                    .build();
        } else {
            profile.setDisplayName(request.getDisplayName());
            profile.setBio(request.getBiography());
            profile.setWebsite(request.getWebsite());
            profile.setInstagram(request.getInstagram());
            profile.setCountry(request.getCountry());
            profile.setYearsExperience(request.getYearsExperience());
            profile.setStatus(ArtistStatus.PENDING);
            profile.setRejectionReason(null);
            profile.setApprovedAt(null);
        }
        artistProfileRepository.save(profile);

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone());
            userRepository.save(user);
        }

        ArtistApplication application = ArtistApplication.builder()
                .user(user)
                .status(ApplicationStatus.PENDING)
                .biography(request.getBiography())
                .portfolioUrl(request.getPortfolioUrl())
                .website(request.getWebsite())
                .instagram(request.getInstagram())
                .yearsExperience(request.getYearsExperience())
                .country(request.getCountry())
                .phone(request.getPhone())
                .build();
        artistApplicationRepository.save(application);

        return toApplicationResponse(application, profile.getDisplayName(), user.getEmail());
    }

    @Transactional(readOnly = true)
    public List<ArtistResponse> listApproved() {
        return artistProfileRepository.findByStatus(ArtistStatus.APPROVED).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ArtistResponse getById(UUID id) {
        ArtistProfile profile = artistProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist", id));
        if (profile.getStatus() != ArtistStatus.APPROVED) {
            throw new ResourceNotFoundException("Artist", id);
        }
        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public ArtistResponse getMe(UserPrincipal principal) {
        ArtistProfile profile = artistProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Artist profile not found for current user"));
        return toResponse(profile);
    }

    @Transactional
    public ArtistResponse updateMe(UserPrincipal principal, ArtistProfileUpdateRequest request) {
        ArtistProfile profile = artistProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Artist profile not found for current user"));

        if (profile.getStatus() != ArtistStatus.APPROVED && profile.getStatus() != ArtistStatus.PENDING) {
            throw new AccessDeniedException("Artist profile is not editable in current status");
        }

        if (request.getDisplayName() != null) {
            profile.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getWebsite() != null) {
            profile.setWebsite(request.getWebsite());
        }
        if (request.getInstagram() != null) {
            profile.setInstagram(request.getInstagram());
        }
        if (request.getCountry() != null) {
            profile.setCountry(request.getCountry());
        }
        if (request.getYearsExperience() != null) {
            profile.setYearsExperience(request.getYearsExperience());
        }

        return toResponse(artistProfileRepository.save(profile));
    }

    public ArtistResponse toResponse(ArtistProfile profile) {
        return ArtistResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .displayName(profile.getDisplayName())
                .bio(profile.getBio())
                .website(profile.getWebsite())
                .instagram(profile.getInstagram())
                .country(profile.getCountry())
                .yearsExperience(profile.getYearsExperience())
                .status(profile.getStatus().name())
                .approvedAt(profile.getApprovedAt())
                .createdAt(profile.getCreatedAt())
                .build();
    }

    public ArtistApplicationResponse toApplicationResponse(ArtistApplication app, String displayName, String email) {
        return ArtistApplicationResponse.builder()
                .id(app.getId())
                .userId(app.getUser().getId())
                .status(app.getStatus().name())
                .biography(app.getBiography())
                .portfolioUrl(app.getPortfolioUrl())
                .website(app.getWebsite())
                .instagram(app.getInstagram())
                .yearsExperience(app.getYearsExperience())
                .country(app.getCountry())
                .phone(app.getPhone())
                .rejectionReason(app.getRejectionReason())
                .reviewedAt(app.getReviewedAt())
                .createdAt(app.getCreatedAt())
                .displayName(displayName)
                .email(email)
                .build();
    }
}
