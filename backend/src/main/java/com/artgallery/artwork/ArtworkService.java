package com.artgallery.artwork;

import com.artgallery.artwork.dto.ArtworkCreateRequest;
import com.artgallery.artwork.dto.ArtworkImageResponse;
import com.artgallery.artwork.dto.ArtworkResponse;
import com.artgallery.artwork.dto.ArtworkUpdateRequest;
import com.artgallery.artwork.dto.AttachImagesRequest;
import com.artgallery.common.PageResponse;
import com.artgallery.common.exception.BusinessException;
import com.artgallery.common.exception.ResourceNotFoundException;
import com.artgallery.domain.entity.ArtistProfile;
import com.artgallery.domain.entity.Artwork;
import com.artgallery.domain.entity.ArtworkImage;
import com.artgallery.domain.entity.Category;
import com.artgallery.domain.enums.ArtistStatus;
import com.artgallery.domain.enums.ArtworkStatus;
import com.artgallery.domain.enums.RoleName;
import com.artgallery.repository.ArtistProfileRepository;
import com.artgallery.repository.ArtworkImageRepository;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.CategoryRepository;
import com.artgallery.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArtworkService {

    private final ArtworkRepository artworkRepository;
    private final ArtworkImageRepository artworkImageRepository;
    private final ArtistProfileRepository artistProfileRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public PageResponse<ArtworkResponse> searchPublic(
            String q,
            String category,
            String medium,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            UUID artistId,
            String sort,
            int page,
            int size
    ) {
        Specification<Artwork> spec = Specification
                .where(ArtworkSpecifications.published())
                .and(ArtworkSpecifications.search(q))
                .and(ArtworkSpecifications.categorySlug(category))
                .and(ArtworkSpecifications.medium(medium))
                .and(ArtworkSpecifications.minPrice(minPrice))
                .and(ArtworkSpecifications.maxPrice(maxPrice))
                .and(ArtworkSpecifications.artistId(artistId));

        Pageable pageable = PageRequest.of(page, Math.min(size, 50), resolveSort(sort));
        Page<ArtworkResponse> result = artworkRepository.findAll(spec, pageable).map(this::toResponse);
        return PageResponse.from(result);
    }

    @Transactional
    public ArtworkResponse getByIdOrSlug(String idOrSlug, UserPrincipal principal) {
        Artwork artwork = resolveArtwork(idOrSlug);
        boolean published = artwork.getStatus() == ArtworkStatus.PUBLISHED;
        boolean canViewPrivate = principal != null && canAccessArtwork(principal, artwork);

        if (!published && !canViewPrivate) {
            throw new ResourceNotFoundException("Artwork", idOrSlug);
        }

        if (published) {
            artwork.setViewCount(artwork.getViewCount() + 1);
        }
        return toResponse(artwork);
    }

    @Transactional
    public ArtworkResponse create(UserPrincipal principal, ArtworkCreateRequest request) {
        ArtistProfile artist = requireApprovedArtist(principal);

        Artwork artwork = Artwork.builder()
                .artist(artist)
                .title(request.getTitle().trim())
                .slug(uniqueSlug(request.getTitle()))
                .description(request.getDescription())
                .story(request.getStory())
                .medium(request.getMedium())
                .style(request.getStyle())
                .yearCreated(request.getYearCreated())
                .widthCm(request.getWidthCm())
                .heightCm(request.getHeightCm())
                .depthCm(request.getDepthCm())
                .price(request.getPrice())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .quantity(request.getQuantity() != null ? request.getQuantity() : 1)
                .status(ArtworkStatus.DRAFT)
                .viewCount(0L)
                .build();

        if (request.getCategoryId() != null) {
            artwork.setCategory(categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId())));
        }

        return toResponse(artworkRepository.save(artwork));
    }

    @Transactional
    public ArtworkResponse update(UUID id, UserPrincipal principal, ArtworkUpdateRequest request) {
        Artwork artwork = artworkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artwork", id));
        assertCanMutate(principal, artwork);

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            String newTitle = request.getTitle().trim();
            if (!newTitle.equals(artwork.getTitle())) {
                artwork.setTitle(newTitle);
                artwork.setSlug(uniqueSlug(newTitle));
            }
        }
        if (request.getDescription() != null) {
            artwork.setDescription(request.getDescription());
        }
        if (request.getStory() != null) {
            artwork.setStory(request.getStory());
        }
        if (request.getMedium() != null) {
            artwork.setMedium(request.getMedium());
        }
        if (request.getStyle() != null) {
            artwork.setStyle(request.getStyle());
        }
        if (request.getYearCreated() != null) {
            artwork.setYearCreated(request.getYearCreated());
        }
        if (request.getWidthCm() != null) {
            artwork.setWidthCm(request.getWidthCm());
        }
        if (request.getHeightCm() != null) {
            artwork.setHeightCm(request.getHeightCm());
        }
        if (request.getDepthCm() != null) {
            artwork.setDepthCm(request.getDepthCm());
        }
        if (request.getPrice() != null) {
            artwork.setPrice(request.getPrice());
        }
        if (request.getCurrency() != null) {
            artwork.setCurrency(request.getCurrency());
        }
        if (request.getQuantity() != null) {
            artwork.setQuantity(request.getQuantity());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
            artwork.setCategory(category);
        }

        return toResponse(artworkRepository.save(artwork));
    }

    @Transactional
    public void archive(UUID id, UserPrincipal principal) {
        Artwork artwork = artworkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artwork", id));
        assertCanMutate(principal, artwork);
        artwork.setStatus(ArtworkStatus.ARCHIVED);
        artworkRepository.save(artwork);
    }

    @Transactional
    public ArtworkResponse submit(UUID id, UserPrincipal principal) {
        Artwork artwork = artworkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artwork", id));
        assertCanMutate(principal, artwork);

        if (artwork.getStatus() != ArtworkStatus.DRAFT && artwork.getStatus() != ArtworkStatus.REJECTED) {
            throw new BusinessException("Only DRAFT or REJECTED artworks can be submitted");
        }
        artwork.setStatus(ArtworkStatus.PENDING_REVIEW);
        return toResponse(artworkRepository.save(artwork));
    }

    @Transactional(readOnly = true)
    public List<ArtworkResponse> listMyArtworks(UserPrincipal principal) {
        ArtistProfile artist = artistProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Artist profile not found for current user"));
        return artworkRepository.findByArtistId(artist.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ArtworkResponse attachImages(UUID artworkId, UserPrincipal principal, AttachImagesRequest request) {
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new ResourceNotFoundException("Artwork", artworkId));
        assertCanMutate(principal, artwork);

        int order = artwork.getImages().size();
        String primaryKey = request.getPrimaryKey() != null
                ? request.getPrimaryKey()
                : request.getStorageKeys().getFirst();

        for (String key : request.getStorageKeys()) {
            ArtworkImage image = ArtworkImage.builder()
                    .artwork(artwork)
                    .storageKey(key)
                    .originalUrl("/api/v1/media/" + key)
                    .thumbnailUrl("/api/v1/media/" + key)
                    .primary(key.equals(primaryKey))
                    .sortOrder(order++)
                    .build();
            artwork.getImages().add(image);
        }

        if (request.getPrimaryKey() != null) {
            artwork.getImages().forEach(img -> img.setPrimary(img.getStorageKey().equals(request.getPrimaryKey())));
        }

        return toResponse(artworkRepository.save(artwork));
    }

    @Transactional(readOnly = true)
    public PageResponse<ArtworkResponse> adminList(ArtworkStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 50), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Artwork> artworks = status == null
                ? artworkRepository.findAll(pageable)
                : artworkRepository.findByStatus(status, pageable);
        return PageResponse.from(artworks.map(this::toResponse));
    }

    @Transactional
    public ArtworkResponse publish(UUID id) {
        Artwork artwork = artworkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artwork", id));
        if (artwork.getStatus() != ArtworkStatus.PENDING_REVIEW && artwork.getStatus() != ArtworkStatus.APPROVED) {
            throw new BusinessException("Artwork must be PENDING_REVIEW or APPROVED to publish");
        }
        artwork.setStatus(ArtworkStatus.PUBLISHED);
        return toResponse(artworkRepository.save(artwork));
    }

    @Transactional
    public ArtworkResponse reject(UUID id, String reason) {
        Artwork artwork = artworkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artwork", id));
        artwork.setStatus(ArtworkStatus.REJECTED);
        return toResponse(artworkRepository.save(artwork));
    }

    public ArtworkResponse toResponse(Artwork artwork) {
        List<ArtworkImageResponse> images = artwork.getImages() == null ? List.of() :
                artwork.getImages().stream().map(this::toImageResponse).toList();

        return ArtworkResponse.builder()
                .id(artwork.getId())
                .artistId(artwork.getArtist().getId())
                .artistName(artwork.getArtist().getDisplayName())
                .title(artwork.getTitle())
                .slug(artwork.getSlug())
                .description(artwork.getDescription())
                .story(artwork.getStory())
                .medium(artwork.getMedium())
                .style(artwork.getStyle())
                .yearCreated(artwork.getYearCreated())
                .widthCm(artwork.getWidthCm())
                .heightCm(artwork.getHeightCm())
                .depthCm(artwork.getDepthCm())
                .price(artwork.getPrice())
                .currency(artwork.getCurrency())
                .quantity(artwork.getQuantity())
                .status(artwork.getStatus().name())
                .categoryId(artwork.getCategory() != null ? artwork.getCategory().getId() : null)
                .categoryName(artwork.getCategory() != null ? artwork.getCategory().getName() : null)
                .viewCount(artwork.getViewCount())
                .createdAt(artwork.getCreatedAt())
                .updatedAt(artwork.getUpdatedAt())
                .images(images)
                .build();
    }

    private ArtworkImageResponse toImageResponse(ArtworkImage image) {
        return ArtworkImageResponse.builder()
                .id(image.getId())
                .storageKey(image.getStorageKey())
                .originalUrl(image.getOriginalUrl())
                .thumbnailUrl(image.getThumbnailUrl())
                .mimeType(image.getMimeType())
                .width(image.getWidth())
                .height(image.getHeight())
                .sizeBytes(image.getSizeBytes())
                .primary(image.isPrimary())
                .sortOrder(image.getSortOrder())
                .build();
    }

    private Artwork resolveArtwork(String idOrSlug) {
        Optional<Artwork> byId = tryParseUuid(idOrSlug).flatMap(artworkRepository::findById);
        if (byId.isPresent()) {
            return byId.get();
        }
        return artworkRepository.findBySlug(idOrSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Artwork", idOrSlug));
    }

    private Optional<UUID> tryParseUuid(String value) {
        try {
            return Optional.of(UUID.fromString(value));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    private ArtistProfile requireApprovedArtist(UserPrincipal principal) {
        ArtistProfile artist = artistProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new BusinessException("Artist profile required", HttpStatus.FORBIDDEN));
        if (artist.getStatus() != ArtistStatus.APPROVED) {
            throw new BusinessException("Artist profile must be approved", HttpStatus.FORBIDDEN);
        }
        return artist;
    }

    private void assertCanMutate(UserPrincipal principal, Artwork artwork) {
        if (principal.hasRole(RoleName.ROLE_OWNER)) {
            return;
        }
        ArtistProfile artist = artistProfileRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new AccessDeniedException("Not an artist"));
        if (!artwork.getArtist().getId().equals(artist.getId())) {
            throw new AccessDeniedException("Cannot mutate another artist's artwork");
        }
    }

    private boolean canAccessArtwork(UserPrincipal principal, Artwork artwork) {
        if (principal.hasRole(RoleName.ROLE_OWNER)) {
            return true;
        }
        return artistProfileRepository.findByUserId(principal.getId())
                .map(profile -> profile.getId().equals(artwork.getArtist().getId()))
                .orElse(false);
    }

    private String uniqueSlug(String title) {
        String base = slugify(title);
        String slug = base;
        int i = 1;
        while (artworkRepository.existsBySlug(slug)) {
            slug = base + "-" + i++;
        }
        return slug;
    }

    private String slugify(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return normalized.isBlank() ? "artwork-" + UUID.randomUUID().toString().substring(0, 8) : normalized;
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        return switch (sort.toLowerCase(Locale.ROOT)) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "title" -> Sort.by(Sort.Direction.ASC, "title");
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
