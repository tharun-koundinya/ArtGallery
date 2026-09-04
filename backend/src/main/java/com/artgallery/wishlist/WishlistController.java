package com.artgallery.wishlist;

import com.artgallery.common.ApiResponse;
import com.artgallery.security.CurrentUser;
import com.artgallery.security.UserPrincipal;
import com.artgallery.wishlist.dto.WishlistResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wishlist")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ApiResponse<WishlistResponse> get(@CurrentUser UserPrincipal principal) {
        return ApiResponse.ok(wishlistService.getWishlist(principal));
    }

    @PostMapping("/{artworkId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<WishlistResponse> add(
            @CurrentUser UserPrincipal principal,
            @PathVariable UUID artworkId
    ) {
        return ApiResponse.ok(wishlistService.add(principal, artworkId));
    }

    @DeleteMapping("/{artworkId}")
    public ApiResponse<WishlistResponse> remove(
            @CurrentUser UserPrincipal principal,
            @PathVariable UUID artworkId
    ) {
        return ApiResponse.ok(wishlistService.remove(principal, artworkId));
    }
}
