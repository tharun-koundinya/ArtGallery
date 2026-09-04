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
public class ArtistResponse {
    private UUID id;
    private UUID userId;
    private String displayName;
    private String bio;
    private String website;
    private String instagram;
    private String country;
    private Integer yearsExperience;
    private String status;
    private Instant approvedAt;
    private Instant createdAt;
}
