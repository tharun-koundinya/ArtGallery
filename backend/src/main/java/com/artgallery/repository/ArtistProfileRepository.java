package com.artgallery.repository;

import com.artgallery.domain.entity.ArtistProfile;
import com.artgallery.domain.enums.ArtistStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArtistProfileRepository extends JpaRepository<ArtistProfile, UUID> {
    Optional<ArtistProfile> findByUserId(UUID userId);
    List<ArtistProfile> findByStatus(ArtistStatus status);
    long countByStatus(ArtistStatus status);
    boolean existsByUserIdAndStatusIn(UUID userId, List<ArtistStatus> statuses);
}
