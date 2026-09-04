package com.artgallery.seed;

import com.artgallery.domain.entity.ArtistProfile;
import com.artgallery.domain.entity.Artwork;
import com.artgallery.domain.entity.ArtworkImage;
import com.artgallery.domain.entity.Category;
import com.artgallery.domain.entity.Role;
import com.artgallery.domain.entity.User;
import com.artgallery.domain.enums.ArtistStatus;
import com.artgallery.domain.enums.ArtworkStatus;
import com.artgallery.domain.enums.RoleName;
import com.artgallery.domain.enums.UserStatus;
import com.artgallery.repository.ArtistProfileRepository;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.CategoryRepository;
import com.artgallery.repository.RoleRepository;
import com.artgallery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ArtistProfileRepository artistProfileRepository;
    private final CategoryRepository categoryRepository;
    private final ArtworkRepository artworkRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Role ownerRole = roleRepository.findByName(RoleName.ROLE_OWNER)
                .orElseThrow(() -> new IllegalStateException("ROLE_OWNER missing from migration"));

        boolean ownerExists = userRepository.findAll().stream()
                .anyMatch(u -> u.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_OWNER));

        if (ownerExists) {
            log.info("Seed skipped: owner already present");
            return;
        }

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new IllegalStateException("ROLE_USER missing"));
        Role artistRole = roleRepository.findByName(RoleName.ROLE_ARTIST)
                .orElseThrow(() -> new IllegalStateException("ROLE_ARTIST missing"));

        User owner = userRepository.save(User.builder()
                .email("owner@artgallery.com")
                .passwordHash(passwordEncoder.encode("Owner@12345"))
                .fullName("Gallery Owner")
                .status(UserStatus.ACTIVE)
                .roles(new java.util.HashSet<>(Set.of(ownerRole, userRole)))
                .build());

        User collector = userRepository.save(User.builder()
                .email("collector@artgallery.com")
                .passwordHash(passwordEncoder.encode("Collector@12345"))
                .fullName("Demo Collector")
                .status(UserStatus.ACTIVE)
                .roles(new java.util.HashSet<>(Set.of(userRole)))
                .build());

        User artistUser = userRepository.save(User.builder()
                .email("artist@artgallery.com")
                .passwordHash(passwordEncoder.encode("Artist@12345"))
                .fullName("Demo Artist")
                .phone("+91-9876543210")
                .status(UserStatus.ACTIVE)
                .roles(new java.util.HashSet<>(Set.of(userRole, artistRole)))
                .build());

        ArtistProfile artistProfile = artistProfileRepository.save(ArtistProfile.builder()
                .user(artistUser)
                .displayName("Aria Mehra")
                .bio("Contemporary painter exploring light, memory, and South Asian landscapes.")
                .website("https://example.com/aria")
                .instagram("@ariamehra.art")
                .country("India")
                .yearsExperience(12)
                .status(ArtistStatus.APPROVED)
                .approvedAt(Instant.now())
                .build());

        List<Category> categories = List.of(
                category("Landscape", "landscape", "Natural and urban landscapes"),
                category("Abstract", "abstract", "Abstract compositions and color fields"),
                category("Portrait", "portrait", "Figurative and portrait works"),
                category("Contemporary", "contemporary", "Contemporary mixed media"),
                category("Sculpture", "sculpture", "Three-dimensional works")
        );
        categories = categoryRepository.saveAll(categories);

        seedArtworks(artistProfile, categories);

        log.info("Seeded owner={}, collector={}, artist={}", owner.getEmail(), collector.getEmail(), artistUser.getEmail());
    }

    private void seedArtworks(ArtistProfile artist, List<Category> categories) {
        record SeedArtwork(
                String title,
                String slug,
                String description,
                String medium,
                String style,
                int year,
                String price,
                int categoryIndex,
                String imageUrl
        ) {
        }

        List<SeedArtwork> seeds = List.of(
                new SeedArtwork(
                        "Monsoon Terrace", "monsoon-terrace",
                        "Rain-washed rooftops under a violet sky.",
                        "Oil on canvas", "Impressionist", 2022, "45000", 0,
                        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800"
                ),
                new SeedArtwork(
                        "Saffron Drift", "saffron-drift",
                        "Layered pigments recalling festival dust and dusk.",
                        "Acrylic", "Abstract", 2023, "38000", 1,
                        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800"
                ),
                new SeedArtwork(
                        "Quiet Companion", "quiet-companion",
                        "A seated figure in soft afternoon light.",
                        "Charcoal & pastel", "Portrait", 2021, "52000", 2,
                        "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800"
                ),
                new SeedArtwork(
                        "City After Rain", "city-after-rain",
                        "Reflections on wet asphalt between neon signs.",
                        "Mixed media", "Contemporary", 2024, "61000", 3,
                        "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800"
                ),
                new SeedArtwork(
                        "Bronze Whisper", "bronze-whisper",
                        "Compact sculpture of folded fabric and wind.",
                        "Bronze", "Modern", 2020, "95000", 4,
                        "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800"
                ),
                new SeedArtwork(
                        "Hill Station Fog", "hill-station-fog",
                        "Pine silhouettes dissolving into morning mist.",
                        "Watercolor", "Landscape", 2023, "28000", 0,
                        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800"
                ),
                new SeedArtwork(
                        "Geometry of Calm", "geometry-of-calm",
                        "Balanced planes in indigo, chalk, and gold leaf.",
                        "Acrylic on wood", "Abstract", 2024, "42000", 1,
                        "https://images.unsplash.com/photo-1561214115-f2f760202781?w=800"
                ),
                new SeedArtwork(
                        "Studio Window", "studio-window",
                        "Self-portrait reflected in a sunlit pane.",
                        "Oil", "Portrait", 2022, "57000", 2,
                        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800"
                )
        );

        for (SeedArtwork seed : seeds) {
            Artwork artwork = Artwork.builder()
                    .artist(artist)
                    .title(seed.title())
                    .slug(seed.slug())
                    .description(seed.description())
                    .story("Created in the demo studio for the Art Gallery Phase A showcase.")
                    .medium(seed.medium())
                    .style(seed.style())
                    .yearCreated(seed.year())
                    .widthCm(new BigDecimal("60.00"))
                    .heightCm(new BigDecimal("80.00"))
                    .price(new BigDecimal(seed.price()))
                    .currency("INR")
                    .quantity(1)
                    .status(ArtworkStatus.PUBLISHED)
                    .category(categories.get(seed.categoryIndex()))
                    .viewCount(0L)
                    .build();

            ArtworkImage image = ArtworkImage.builder()
                    .artwork(artwork)
                    .storageKey("seed/" + seed.slug())
                    .originalUrl(seed.imageUrl())
                    .thumbnailUrl(seed.imageUrl())
                    .mimeType("image/jpeg")
                    .primary(true)
                    .sortOrder(0)
                    .build();
            artwork.getImages().add(image);
            artworkRepository.save(artwork);
        }
    }

    private Category category(String name, String slug, String description) {
        return Category.builder()
                .name(name)
                .slug(slug)
                .description(description)
                .build();
    }
}
