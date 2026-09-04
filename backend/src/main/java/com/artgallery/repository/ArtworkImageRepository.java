package com.artgallery.repository;

import com.artgallery.domain.entity.ArtworkImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ArtworkImageRepository extends JpaRepository<ArtworkImage, UUID> {
    List<ArtworkImage> findByArtworkIdOrderBySortOrderAsc(UUID artworkId);
}
