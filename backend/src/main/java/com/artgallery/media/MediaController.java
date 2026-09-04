package com.artgallery.media;

import com.artgallery.common.ApiResponse;
import com.artgallery.media.dto.MediaUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ARTIST', 'OWNER')")
    public ApiResponse<MediaUploadResponse> upload(@RequestPart("file") MultipartFile file) {
        return ApiResponse.ok("Uploaded", mediaService.store(file));
    }

    @GetMapping("/{storageKey:.+}")
    public ResponseEntity<Resource> serve(@PathVariable String storageKey) {
        Resource resource = mediaService.loadAsResource(storageKey);
        String contentType = mediaService.detectContentType(storageKey);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
