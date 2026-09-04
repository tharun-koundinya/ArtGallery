package com.artgallery.artist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtistApplyRequest {

    @NotBlank
    @Size(max = 255)
    private String displayName;

    @Size(max = 5000)
    private String biography;

    private String portfolioUrl;
    private String website;
    private String instagram;
    private Integer yearsExperience;
    private String country;
    private String phone;
}
