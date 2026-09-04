package com.artgallery.media;

import com.artgallery.common.exception.BusinessException;
import com.artgallery.common.exception.ResourceNotFoundException;
import com.artgallery.config.AppProperties;
import com.artgallery.media.dto.MediaUploadResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    private final AppProperties appProperties;
    private Path uploadRoot;

    @PostConstruct
    void init() throws IOException {
        uploadRoot = Paths.get(appProperties.getMedia().getUploadDir()).toAbsolutePath().normalize();
        Files.createDirectories(uploadRoot);
    }

    public MediaUploadResponse store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("File is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new BusinessException("Unsupported file type. Allowed: jpeg, png, webp, gif");
        }

        String extension = extensionFor(contentType);
        String storageKey = UUID.randomUUID() + extension;
        Path target = uploadRoot.resolve(storageKey).normalize();
        if (!target.startsWith(uploadRoot)) {
            throw new BusinessException("Invalid storage path", HttpStatus.BAD_REQUEST);
        }

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new BusinessException("Failed to store file", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        String url = "/api/v1/media/" + storageKey;
        return MediaUploadResponse.builder()
                .storageKey(storageKey)
                .originalUrl(url)
                .thumbnailUrl(url)
                .mimeType(contentType)
                .sizeBytes(file.getSize())
                .build();
    }

    public Resource loadAsResource(String storageKey) {
        try {
            Path file = uploadRoot.resolve(storageKey).normalize();
            if (!file.startsWith(uploadRoot) || !Files.exists(file)) {
                throw new ResourceNotFoundException("Media", storageKey);
            }
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Media", storageKey);
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Media", storageKey);
        }
    }

    public String detectContentType(String storageKey) {
        try {
            Path file = uploadRoot.resolve(storageKey).normalize();
            String probed = Files.probeContentType(file);
            return probed != null ? probed : "application/octet-stream";
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }

    private String extensionFor(String contentType) {
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }
}
