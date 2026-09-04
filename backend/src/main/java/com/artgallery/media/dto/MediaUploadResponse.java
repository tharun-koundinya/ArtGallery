package com.artgallery.media.dto;

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
public class MediaUploadResponse {
    private String storageKey;
    private String originalUrl;
    private String thumbnailUrl;
    private String mimeType;
    private long sizeBytes;
}
