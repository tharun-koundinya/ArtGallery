-- V1__init.sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT ck_users_status CHECK (status IN ('ACTIVE', 'DISABLED'))
);

CREATE TABLE roles (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT uk_roles_name UNIQUE (name),
    CONSTRAINT ck_roles_name CHECK (name IN ('ROLE_USER', 'ROLE_ARTIST', 'ROLE_OWNER'))
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens (token_hash);

CREATE TABLE artist_profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    bio TEXT,
    website VARCHAR(500),
    instagram VARCHAR(255),
    country VARCHAR(100),
    years_experience INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_artist_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_artist_profiles_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT ck_artist_profiles_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'))
);

CREATE TABLE artist_applications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    biography TEXT,
    portfolio_url VARCHAR(500),
    website VARCHAR(500),
    instagram VARCHAR(255),
    years_experience INTEGER,
    country VARCHAR(100),
    phone VARCHAR(50),
    rejection_reason TEXT,
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_artist_applications_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_artist_applications_reviewer FOREIGN KEY (reviewed_by) REFERENCES users (id),
    CONSTRAINT ck_artist_applications_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

CREATE INDEX idx_artist_applications_user ON artist_applications (user_id);
CREATE INDEX idx_artist_applications_status ON artist_applications (status);

CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID,
    CONSTRAINT uk_categories_slug UNIQUE (slug),
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories (id)
);

CREATE TABLE artworks (
    id UUID PRIMARY KEY,
    artist_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    story TEXT,
    medium VARCHAR(100),
    style VARCHAR(100),
    year_created INTEGER,
    width_cm DECIMAL(10, 2),
    height_cm DECIMAL(10, 2),
    depth_cm DECIMAL(10, 2),
    price DECIMAL(14, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    quantity INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    category_id UUID,
    view_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_artworks_artist FOREIGN KEY (artist_id) REFERENCES artist_profiles (id),
    CONSTRAINT fk_artworks_category FOREIGN KEY (category_id) REFERENCES categories (id),
    CONSTRAINT uk_artworks_slug UNIQUE (slug),
    CONSTRAINT ck_artworks_status CHECK (status IN (
        'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED',
        'PUBLISHED', 'SOLD', 'ARCHIVED', 'SUSPENDED'
    ))
);

CREATE INDEX idx_artworks_status ON artworks (status);
CREATE INDEX idx_artworks_artist ON artworks (artist_id);
CREATE INDEX idx_artworks_category ON artworks (category_id);
CREATE INDEX idx_artworks_price ON artworks (price);

CREATE TABLE artwork_images (
    id UUID PRIMARY KEY,
    artwork_id UUID NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    original_url VARCHAR(1000),
    thumbnail_url VARCHAR(1000),
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    size_bytes BIGINT,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_artwork_images_artwork FOREIGN KEY (artwork_id) REFERENCES artworks (id)
);

CREATE INDEX idx_artwork_images_artwork ON artwork_images (artwork_id);

CREATE TABLE wishlists (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    CONSTRAINT uk_wishlists_user UNIQUE (user_id),
    CONSTRAINT fk_wishlists_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY,
    wishlist_id UUID NOT NULL,
    artwork_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wishlist_items_wishlist FOREIGN KEY (wishlist_id) REFERENCES wishlists (id),
    CONSTRAINT fk_wishlist_items_artwork FOREIGN KEY (artwork_id) REFERENCES artworks (id),
    CONSTRAINT uk_wishlist_items_pair UNIQUE (wishlist_id, artwork_id)
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    actor_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_value CLOB,
    new_value CLOB,
    ip VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_id) REFERENCES users (id)
);

CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs (actor_id);

INSERT INTO roles (id, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'ROLE_USER'),
    ('22222222-2222-2222-2222-222222222222', 'ROLE_ARTIST'),
    ('33333333-3333-3333-3333-333333333333', 'ROLE_OWNER');
