package com.artgallery.wishlist.dto;

import com.artgallery.artwork.dto.ArtworkResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistResponse {
    private UUID id;
    private List<WishlistItemResponse> items;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WishlistItemResponse {
        private UUID id;
        private Instant createdAt;
        private ArtworkResponse artwork;
    }
}
