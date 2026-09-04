package com.artgallery.artwork.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ArtworkUpdateRequest {

    @Size(max = 255)
    private String title;

    @Size(max = 10000)
    private String description;

    @Size(max = 10000)
    private String story;

    private String medium;
    private String style;
    private Integer yearCreated;
    private BigDecimal widthCm;
    private BigDecimal heightCm;
    private BigDecimal depthCm;

    @DecimalMin("0.0")
    private BigDecimal price;

    private String currency;
    private Integer quantity;
    private UUID categoryId;
}
