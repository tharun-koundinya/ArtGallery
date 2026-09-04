package com.artgallery.artist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistApplicationResponse {
    private UUID id;
    private UUID userId;
    private String status;
    private String biography;
    private String portfolioUrl;
    private String website;
    private String instagram;
    private Integer yearsExperience;
    private String country;
    private String phone;
    private String rejectionReason;
    private Instant reviewedAt;
    private Instant createdAt;
    private String displayName;
    private String email;
}
