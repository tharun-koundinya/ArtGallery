package com.artgallery.repository;

import com.artgallery.domain.entity.Artwork;
import com.artgallery.domain.enums.ArtworkStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArtworkRepository extends JpaRepository<Artwork, UUID>, JpaSpecificationExecutor<Artwork> {
    Optional<Artwork> findBySlug(String slug);
    List<Artwork> findByArtistId(UUID artistId);
    Page<Artwork> findByArtistId(UUID artistId, Pageable pageable);
    Page<Artwork> findByStatus(ArtworkStatus status, Pageable pageable);
    long countByStatus(ArtworkStatus status);
    boolean existsBySlug(String slug);
}
