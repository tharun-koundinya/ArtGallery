package com.artgallery.repository;

import com.artgallery.domain.entity.ArtistApplication;
import com.artgallery.domain.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArtistApplicationRepository extends JpaRepository<ArtistApplication, UUID> {
    List<ArtistApplication> findByStatus(ApplicationStatus status);
    List<ArtistApplication> findAllByOrderByCreatedAtDesc();
    Optional<ArtistApplication> findByUserIdAndStatus(UUID userId, ApplicationStatus status);
    boolean existsByUserIdAndStatus(UUID userId, ApplicationStatus status);
    long countByStatus(ApplicationStatus status);
}
