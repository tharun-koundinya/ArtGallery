package com.artgallery.wishlist;

import com.artgallery.artwork.ArtworkService;
import com.artgallery.common.exception.BusinessException;
import com.artgallery.common.exception.ResourceNotFoundException;
import com.artgallery.domain.entity.Artwork;
import com.artgallery.domain.entity.User;
import com.artgallery.domain.entity.Wishlist;
import com.artgallery.domain.entity.WishlistItem;
import com.artgallery.domain.enums.ArtworkStatus;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.repository.WishlistItemRepository;
import com.artgallery.repository.WishlistRepository;
import com.artgallery.security.UserPrincipal;
import com.artgallery.wishlist.dto.WishlistResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ArtworkRepository artworkRepository;
    private final UserRepository userRepository;
    private final ArtworkService artworkService;

    @Transactional(readOnly = true)
    public WishlistResponse getWishlist(UserPrincipal principal) {
        Wishlist wishlist = getOrCreate(principal.getId());
        return toResponse(wishlist);
    }

    @Transactional
    public WishlistResponse add(UserPrincipal principal, UUID artworkId) {
        Wishlist wishlist = getOrCreate(principal.getId());
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new ResourceNotFoundException("Artwork", artworkId));

        if (artwork.getStatus() != ArtworkStatus.PUBLISHED) {
            throw new BusinessException("Only published artworks can be wishlisted");
        }

        if (wishlistItemRepository.existsByWishlistIdAndArtworkId(wishlist.getId(), artworkId)) {
            throw new BusinessException("Artwork already in wishlist", HttpStatus.CONFLICT);
        }

        WishlistItem item = WishlistItem.builder()
                .wishlist(wishlist)
                .artwork(artwork)
                .build();
        wishlist.getItems().add(item);
        wishlistRepository.save(wishlist);
        return toResponse(wishlist);
    }

    @Transactional
    public WishlistResponse remove(UserPrincipal principal, UUID artworkId) {
        Wishlist wishlist = getOrCreate(principal.getId());
        wishlist.getItems().removeIf(item -> item.getArtwork().getId().equals(artworkId));
        wishlistRepository.save(wishlist);
        return toResponse(wishlist);
    }

    private Wishlist getOrCreate(UUID userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            return wishlistRepository.save(Wishlist.builder().user(user).build());
        });
    }

    private WishlistResponse toResponse(Wishlist wishlist) {
        return WishlistResponse.builder()
                .id(wishlist.getId())
                .items(wishlist.getItems().stream()
                        .map(item -> WishlistResponse.WishlistItemResponse.builder()
                                .id(item.getId())
                                .createdAt(item.getCreatedAt())
                                .artwork(artworkService.toResponse(item.getArtwork()))
                                .build())
                        .toList())
                .build();
    }
}
