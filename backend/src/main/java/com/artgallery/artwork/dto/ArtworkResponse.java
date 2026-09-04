package com.artgallery.artwork.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtworkResponse {
    private UUID id;
    private UUID artistId;
    private String artistName;
    private String title;
    private String slug;
    private String description;
    private String story;
    private String medium;
    private String style;
    private Integer yearCreated;
    private BigDecimal widthCm;
    private BigDecimal heightCm;
    private BigDecimal depthCm;
    private BigDecimal price;
    private String currency;
    private Integer quantity;
    private String status;
    private UUID categoryId;
    private String categoryName;
    private Long viewCount;
    private Instant createdAt;
    private Instant updatedAt;
    private List<ArtworkImageResponse> images;
}
