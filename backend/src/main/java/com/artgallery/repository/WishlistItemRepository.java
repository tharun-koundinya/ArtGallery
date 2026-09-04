package com.artgallery.repository;

import com.artgallery.domain.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, UUID> {
    Optional<WishlistItem> findByWishlistIdAndArtworkId(UUID wishlistId, UUID artworkId);
    boolean existsByWishlistIdAndArtworkId(UUID wishlistId, UUID artworkId);
    void deleteByWishlistIdAndArtworkId(UUID wishlistId, UUID artworkId);
}
