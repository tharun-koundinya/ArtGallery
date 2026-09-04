package com.artgallery.artist.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtistProfileUpdateRequest {

    @Size(max = 255)
    private String displayName;

    @Size(max = 5000)
    private String bio;

    private String website;
    private String instagram;
    private String country;
    private Integer yearsExperience;
}
