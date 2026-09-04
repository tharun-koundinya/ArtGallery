package com.artgallery.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CategoryRequest {

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String slug;

    private String description;
    private UUID parentId;
}
