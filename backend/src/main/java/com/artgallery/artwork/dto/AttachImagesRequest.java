package com.artgallery.artwork.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AttachImagesRequest {

    @NotEmpty
    private List<String> storageKeys;

    private String primaryKey;
}
