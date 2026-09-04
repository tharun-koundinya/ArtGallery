package com.artgallery.admin;

import com.artgallery.admin.dto.DashboardStatsResponse;
import com.artgallery.admin.dto.RejectRequest;
import com.artgallery.artist.dto.ArtistApplicationResponse;
import com.artgallery.artwork.dto.ArtworkResponse;
import com.artgallery.auth.dto.UserResponse;
import com.artgallery.category.CategoryService;
import com.artgallery.category.dto.CategoryRequest;
import com.artgallery.category.dto.CategoryResponse;
import com.artgallery.common.ApiResponse;
import com.artgallery.common.PageResponse;
import com.artgallery.domain.enums.ApplicationStatus;
import com.artgallery.domain.enums.ArtworkStatus;
import com.artgallery.security.CurrentUser;
import com.artgallery.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('OWNER')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final CategoryService categoryService;

    @GetMapping("/applications")
    public ApiResponse<List<ArtistApplicationResponse>> applications(
            @RequestParam(required = false) ApplicationStatus status
    ) {
        return ApiResponse.ok(adminService.listApplications(status));
    }

    @PostMapping("/applications/{id}/approve")
    public ApiResponse<ArtistApplicationResponse> approve(
            @PathVariable UUID id,
            @CurrentUser UserPrincipal principal,
            HttpServletRequest request
    ) {
        return ApiResponse.ok("Application approved", adminService.approveApplication(id, principal, request));
    }

    @PostMapping("/applications/{id}/reject")
    public ApiResponse<ArtistApplicationResponse> reject(
            @PathVariable UUID id,
            @Valid @RequestBody RejectRequest body,
            @CurrentUser UserPrincipal principal,
            HttpServletRequest request
    ) {
        return ApiResponse.ok("Application rejected", adminService.rejectApplication(id, body, principal, request));
    }

    @GetMapping("/dashboard/stats")
    public ApiResponse<DashboardStatsResponse> stats() {
        return ApiResponse.ok(adminService.dashboardStats());
    }

    @GetMapping("/artworks")
    public ApiResponse<PageResponse<ArtworkResponse>> artworks(
            @RequestParam(required = false) ArtworkStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.ok(adminService.listArtworks(status, page, size));
    }

    @PostMapping("/artworks/{id}/publish")
    public ApiResponse<ArtworkResponse> publish(
            @PathVariable UUID id,
            @CurrentUser UserPrincipal principal,
            HttpServletRequest request
    ) {
        return ApiResponse.ok("Artwork published", adminService.publishArtwork(id, principal, request));
    }

    @PostMapping("/artworks/{id}/reject")
    public ApiResponse<ArtworkResponse> rejectArtwork(
            @PathVariable UUID id,
            @Valid @RequestBody RejectRequest body,
            @CurrentUser UserPrincipal principal,
            HttpServletRequest request
    ) {
        return ApiResponse.ok("Artwork rejected", adminService.rejectArtwork(id, body, principal, request));
    }

    @GetMapping("/users")
    public ApiResponse<PageResponse<UserResponse>> users(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.ok(adminService.listUsers(page, size));
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ApiResponse.ok("Category created", categoryService.create(request));
    }

    @PutMapping("/categories/{id}")
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody CategoryRequest request
    ) {
        return ApiResponse.ok(categoryService.update(id, request));
    }
}
