CREATE DATABASE IF NOT EXISTS le0flix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE le0flix;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(80) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  is_email_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS movies (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  synopsis TEXT NULL,
  release_year SMALLINT UNSIGNED NULL,
  duration_minutes SMALLINT UNSIGNED NULL,
  maturity_rating VARCHAR(20) NULL,
  thumbnail_url VARCHAR(500) NULL,
  backdrop_url VARCHAR(500) NULL,
  hls_base_path VARCHAR(500) NOT NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_movies_published (is_published),
  KEY idx_movies_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(80) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS movie_categories (
  movie_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (movie_id, category_id),
  CONSTRAINT fk_mc_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  CONSTRAINT fk_mc_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS watch_progress (
  user_id BIGINT UNSIGNED NOT NULL,
  movie_id BIGINT UNSIGNED NOT NULL,
  position_seconds INT UNSIGNED NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, movie_id),
  CONSTRAINT fk_wp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_wp_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  KEY idx_wp_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS auth_refresh_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  revoked_at DATETIME NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_art_user (user_id),
  KEY idx_art_expires (expires_at),
  CONSTRAINT fk_art_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS streaming_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  movie_id BIGINT UNSIGNED NOT NULL,
  session_token_hash VARCHAR(255) NOT NULL,
  ip VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ss_user (user_id),
  KEY idx_ss_movie (movie_id),
  KEY idx_ss_expires (expires_at),
  CONSTRAINT fk_ss_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ss_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO categories (id, name, slug) VALUES
  (1, 'Indépendant', 'independant'),
  (2, 'Domaine public', 'domaine-public'),
  (3, 'Démo', 'demo'),
  (4, 'Action', 'action'),
  (5, 'Aventure', 'aventure'),
  (6, 'Comédie', 'comedie'),
  (7, 'Science-Fiction', 'science-fiction'),
  (8, 'Animation', 'animation'),
  (9, 'Thriller', 'thriller');

INSERT INTO movies (id, title, synopsis, release_year, duration_minutes, maturity_rating, thumbnail_url, backdrop_url, hls_base_path, is_published)
VALUES
  (1, 'Big Buck Bunny (Demo)', 'Film d’animation open source, souvent utilisé en démonstration.', 2008, 10, 'G', 'https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg', 'https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg', '/hls/1', 1),
  (2, 'Avatar : La voie de l’eau', 'La famille Sully affronte de nouveaux dangers sur Pandora.', 2022, 192, '13+', 'https://i.ytimg.com/vi/d9MyW72ELq0/hqdefault.jpg', 'https://i.ytimg.com/vi/d9MyW72ELq0/maxresdefault.jpg', '/hls/2', 1),
  (3, 'Spider-Man : No Way Home', 'L’identité de Spider-Man est révélée, l’équilibre bascule.', 2021, 148, '13+', 'https://i.ytimg.com/vi/JfVOs4VSpmA/hqdefault.jpg', 'https://i.ytimg.com/vi/JfVOs4VSpmA/maxresdefault.jpg', '/hls/3', 1),
  (4, 'Dune', 'Une destinée hors du commun au cœur d’un désert impitoyable.', 2021, 155, '13+', 'https://i.ytimg.com/vi/n9xhJrPXop4/hqdefault.jpg', 'https://i.ytimg.com/vi/n9xhJrPXop4/maxresdefault.jpg', '/hls/4', 1),
  (5, 'Inception', 'Un voleur infiltre les rêves pour voler des secrets.', 2010, 148, '13+', 'https://i.ytimg.com/vi/YoHD9XEInc0/hqdefault.jpg', 'https://i.ytimg.com/vi/YoHD9XEInc0/maxresdefault.jpg', '/hls/5', 1),
  (6, 'Interstellar', 'Un voyage spatial pour sauver l’humanité.', 2014, 169, '10+', 'https://i.ytimg.com/vi/zSWdZVtXT7E/hqdefault.jpg', 'https://i.ytimg.com/vi/zSWdZVtXT7E/maxresdefault.jpg', '/hls/6', 1),
  (7, 'The Dark Knight', 'Gotham vacille face à un adversaire imprévisible.', 2008, 152, '13+', 'https://i.ytimg.com/vi/EXeTwQWrcwY/hqdefault.jpg', 'https://i.ytimg.com/vi/EXeTwQWrcwY/maxresdefault.jpg', '/hls/7', 1),
  (8, 'Mad Max : Fury Road', 'Une poursuite explosive dans un monde post-apocalyptique.', 2015, 120, '16+', 'https://i.ytimg.com/vi/hEJnMQG9ev8/hqdefault.jpg', 'https://i.ytimg.com/vi/hEJnMQG9ev8/maxresdefault.jpg', '/hls/8', 1),
  (9, 'Joker', 'La chute d’un homme vers la folie et le chaos.', 2019, 122, '16+', 'https://i.ytimg.com/vi/zAGVQLHvwOY/hqdefault.jpg', 'https://i.ytimg.com/vi/zAGVQLHvwOY/maxresdefault.jpg', '/hls/9', 1),
  (10, 'John Wick', 'Un ex-tueur revient, et tout devient personnel.', 2014, 101, '16+', 'https://i.ytimg.com/vi/2AUmvWm5ZDQ/hqdefault.jpg', 'https://i.ytimg.com/vi/2AUmvWm5ZDQ/maxresdefault.jpg', '/hls/10', 1),
  (11, 'La Reine des Neiges', 'Deux sœurs, un royaume, et une magie incontrôlable.', 2013, 102, 'G', 'https://i.ytimg.com/vi/TbQm5doF_Uc/hqdefault.jpg', 'https://i.ytimg.com/vi/TbQm5doF_Uc/maxresdefault.jpg', '/hls/11', 1),
  (12, 'Moi, Moche et Méchant : Minions', 'Les minions partent en quête du super-vilain parfait.', 2015, 91, 'G', 'https://i.ytimg.com/vi/eisKxhjBnZ0/hqdefault.jpg', 'https://i.ytimg.com/vi/eisKxhjBnZ0/maxresdefault.jpg', '/hls/12', 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  synopsis = VALUES(synopsis),
  release_year = VALUES(release_year),
  duration_minutes = VALUES(duration_minutes),
  maturity_rating = VALUES(maturity_rating),
  thumbnail_url = VALUES(thumbnail_url),
  backdrop_url = VALUES(backdrop_url),
  hls_base_path = VALUES(hls_base_path),
  is_published = VALUES(is_published);

INSERT IGNORE INTO movie_categories (movie_id, category_id) VALUES
  (1, 3),
  (1, 8),
  (2, 4),
  (2, 9),
  (3, 7),
  (3, 4),
  (4, 5),
  (4, 9),
  (5, 4),
  (5, 9),
  (6, 6),
  (6, 1),
  (7, 7),
  (7, 5),
  (8, 8),
  (8, 2),
  (9, 9),
  (9, 1),
  (10, 5),
  (10, 4),
  (11, 1),
  (11, 6),
  (12, 2),
  (12, 3);
