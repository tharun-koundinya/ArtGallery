package com.artgallery.admin.dto;

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
public class DashboardStatsResponse {
    private long users;
    private long artists;
    private long artworks;
    private long publishedArtworks;
    private long pendingApplications;
    private long pendingArtworks;
}
