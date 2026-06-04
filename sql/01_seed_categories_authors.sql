

-- Thêm thể loại
INSERT INTO category (name, description, slug) VALUES
('Manga',        'Truyện tranh Nhật Bản',           'manga'),
('Light Novel',  'Tiểu thuyết nhẹ Nhật Bản',        'light-novel'),
('Tiểu thuyết',  'Tiểu thuyết trong và ngoài nước',  'tieu-thuyet'),
('Ngôn tình',    'Truyện tình cảm lãng mạn',        'ngon-tinh'),
('Trinh thám',    'Truyện điều tra, đấu trí, phá án',        'trinh-tham')
ON CONFLICT DO NOTHING;

-- Thêm tác giả
INSERT INTO author (name, nationality, bio, avatar_url) VALUES
('Eiichiro Oda',        'Nhật Bản', 'Tác giả bộ truyện One Piece nổi tiếng thế giới',           '/images/authors/oda.jpg'),
('Masashi Kishimoto',   'Nhật Bản', 'Tác giả bộ truyện Naruto',                                 '/images/authors/masashi_kishimoto.jpg'),
('Gosho Aoyama',        'Nhật Bản', 'Tác giả bộ truyện Thám Tử Conan',                          '/images/authors/gosho_aoyama.jpg'),
('Akira Toriyama',      'Nhật Bản', 'Tác giả huyền thoại Dragon Ball',                          '/images/authors/toriyama_akira.jpg'),
('Reki Kawahara',      'Nhật Bản', 'Tác giả series light novel Sword Art',                      '/images/authors/reki_kawahara.jpg'),
('Ernest Hemingway',      'Mỹ', 'Tác giả Ông già và biển cả',                                   '/images/authors/hemingway.jpg'),
('Makoto Shinkai',      'Nhật Bản', 'Tác giả Your Name',                                        '/images/authors/makoto_shinkai.jpg'),
('Cố Mạn',      'Trung Quốc', 'Tác giả nhiều truyện như Yêu Em Từ Cái Nhìn Đầu Tiên, Bên nhau trọn đời....',                          '/images/authors/co_man.jpg'),
('Arthur Conan Doyle',      'Vương Quốc Anh', 'Tác giả tiểu thuyết trinh thám Sherlock Holmes',                          '/images/authors/arthur_conan_doyle.jpg')
ON CONFLICT DO NOTHING;