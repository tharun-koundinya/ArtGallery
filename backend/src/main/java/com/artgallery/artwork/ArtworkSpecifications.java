package com.artgallery.artwork;

import com.artgallery.domain.entity.Artwork;
import com.artgallery.domain.enums.ArtworkStatus;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.UUID;

public final class ArtworkSpecifications {

    private ArtworkSpecifications() {
    }

    public static Specification<Artwork> published() {
        return (root, query, cb) -> cb.equal(root.get("status"), ArtworkStatus.PUBLISHED);
    }

    public static Specification<Artwork> withStatus(ArtworkStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Artwork> search(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) {
                return null;
            }
            String like = "%" + q.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("description")), like),
                    cb.like(cb.lower(root.get("medium")), like),
                    cb.like(cb.lower(root.get("style")), like)
            );
        };
    }

    public static Specification<Artwork> categorySlug(String category) {
        return (root, query, cb) -> {
            if (category == null || category.isBlank()) {
                return null;
            }
            var join = root.join("category", JoinType.LEFT);
            try {
                UUID categoryId = UUID.fromString(category);
                return cb.equal(join.get("id"), categoryId);
            } catch (IllegalArgumentException ex) {
                return cb.equal(cb.lower(join.get("slug")), category.toLowerCase());
            }
        };
    }

    public static Specification<Artwork> medium(String medium) {
        return (root, query, cb) -> {
            if (medium == null || medium.isBlank()) {
                return null;
            }
            return cb.equal(cb.lower(root.get("medium")), medium.toLowerCase());
        };
    }

    public static Specification<Artwork> minPrice(BigDecimal minPrice) {
        return (root, query, cb) -> minPrice == null ? null : cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<Artwork> maxPrice(BigDecimal maxPrice) {
        return (root, query, cb) -> maxPrice == null ? null : cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    public static Specification<Artwork> artistId(UUID artistId) {
        return (root, query, cb) -> artistId == null ? null : cb.equal(root.get("artist").get("id"), artistId);
    }
}
