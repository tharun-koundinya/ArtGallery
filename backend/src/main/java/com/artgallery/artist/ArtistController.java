package com.artgallery.artist;

import com.artgallery.artist.dto.ArtistApplyRequest;
import com.artgallery.artist.dto.ArtistApplicationResponse;
import com.artgallery.artist.dto.ArtistProfileUpdateRequest;
import com.artgallery.artist.dto.ArtistResponse;
import com.artgallery.artwork.ArtworkService;
import com.artgallery.artwork.dto.ArtworkResponse;
import com.artgallery.common.ApiResponse;
import com.artgallery.security.CurrentUser;
import com.artgallery.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistService artistService;
    private final ArtworkService artworkService;

    @PostMapping("/apply")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('USER')")
    public ApiResponse<ArtistApplicationResponse> apply(
            @CurrentUser UserPrincipal principal,
            @Valid @RequestBody ArtistApplyRequest request
    ) {
        return ApiResponse.ok("Application submitted", artistService.apply(principal, request));
    }

    @GetMapping
    public ApiResponse<List<ArtistResponse>> list() {
        return ApiResponse.ok(artistService.listApproved());
    }

    @GetMapping("/{id}")
    public ApiResponse<ArtistResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(artistService.getById(id));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<ArtistResponse> me(@CurrentUser UserPrincipal principal) {
        return ApiResponse.ok(artistService.getMe(principal));
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<ArtistResponse> updateMe(
            @CurrentUser UserPrincipal principal,
            @Valid @RequestBody ArtistProfileUpdateRequest request
    ) {
        return ApiResponse.ok(artistService.updateMe(principal, request));
    }

    @GetMapping("/me/artworks")
    @PreAuthorize("hasRole('ARTIST')")
    public ApiResponse<List<ArtworkResponse>> myArtworks(@CurrentUser UserPrincipal principal) {
        return ApiResponse.ok(artworkService.listMyArtworks(principal));
    }
}
