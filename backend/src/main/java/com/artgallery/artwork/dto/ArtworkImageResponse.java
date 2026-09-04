package com.artgallery.artwork.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtworkImageResponse {
    private java.util.UUID id;
    private String storageKey;
    private String originalUrl;
    private String thumbnailUrl;
    private String mimeType;
    private Integer width;
    private Integer height;
    private Long sizeBytes;
    private boolean primary;
    private Integer sortOrder;
}
