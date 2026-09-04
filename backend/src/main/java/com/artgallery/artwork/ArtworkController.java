package com.artgallery.artwork;

import com.artgallery.artwork.dto.ArtworkCreateRequest;
import com.artgallery.artwork.dto.ArtworkResponse;
import com.artgallery.artwork.dto.ArtworkUpdateRequest;
import com.artgallery.artwork.dto.AttachImagesRequest;
import com.artgallery.common.ApiResponse;
import com.artgallery.common.PageResponse;
import com.artgallery.security.CurrentUser;
import com.artgallery.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/artworks")
@RequiredArgsConstructor
public class ArtworkController {

    private final ArtworkService artworkService;

    @GetMapping
    public ApiResponse<PageResponse<ArtworkResponse>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String medium,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) UUID artistId,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ApiResponse.ok(artworkService.searchPublic(q, category, medium, minPrice, maxPrice, artistId, sort, page, size));
    }

    @GetMapping("/{idOrSlug}")
    public ApiResponse<ArtworkResponse> get(
            @PathVariable String idOrSlug,
            @CurrentUser(errorOnInvalidType = false) UserPrincipal principal
    ) {
        return ApiResponse.ok(artworkService.getByIdOrSlug(idOrSlug, principal));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ARTIST')")
    public ApiResponse<ArtworkResponse> create(
            @CurrentUser UserPrincipal principal,
            @Valid @RequestBody ArtworkCreateRequest request
    ) {
        return ApiResponse.ok("Artwork created", artworkService.create(principal, request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ARTIST', 'OWNER')")
    public ApiResponse<ArtworkResponse> update(
            @PathVariable UUID id,
            @CurrentUser UserPrincipal principal,
            @Valid @RequestBody ArtworkUpdateRequest request
    ) {
        return ApiResponse.ok(artworkService.update(id, principal, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ARTIST', 'OWNER')")
    public ApiResponse<Void> delete(
            @PathVariable UUID id,
            @CurrentUser UserPrincipal principal
    ) {
        artworkService.archive(id, principal);
        return ApiResponse.ok("Artwork archived", null);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('ARTIST')")
    public ApiResponse<ArtworkResponse> submit(
            @PathVariable UUID id,
            @CurrentUser UserPrincipal principal
    ) {
        return ApiResponse.ok("Submitted for review", artworkService.submit(id, principal));
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('ARTIST', 'OWNER')")
    public ApiResponse<ArtworkResponse> attachImages(
            @PathVariable UUID id,
            @CurrentUser UserPrincipal principal,
            @Valid @RequestBody AttachImagesRequest request
    ) {
        return ApiResponse.ok(artworkService.attachImages(id, principal, request));
    }
}
