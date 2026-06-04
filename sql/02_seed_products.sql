-- =============================================
-- SEED DỮ LIỆU: PRODUCT (15-20 bộ truyện)
-- Chạy sau 01_seed_categories_authors.sql
-- =============================================


INSERT INTO product (title, description, price, stock, image_url, is_featured,
                     average_rating, sold_count, publisher, pages, publish_year,
                     status, created_at, category_id, author_id) VALUES

-- ===== ONE PIECE =====
('One Piece - Tập 1 - Bản Bìa Áo (Tái bản 2025)',
 'Monkey D. Luffy giong buồm ra khơi trên chuyến hành trình tìm kho báu huyền thoại One Piece và trở thành Vua hải tặc.',
 30000, 100,
 '/images/products/onepiece1.jpg',
 true, 4.9, 800, 'NXB Kim Đồng', 208, 2025, 'ongoing',
 NOW(), 1, 1),

('One Piece - Tập 2 - Bản Bìa Ảo (Tái bản 2025)',
 'Luffy gặp Roronoa Zoro trong tù và bắt đầu hành trình chiêu mộ thành viên băng hải tặc.',
 30000, 80,
 '/images/products/onepiece2.jpg',
 false, 4.8, 550, 'NXB Kim Đồng', 208, 2025, 'ongoing',
 NOW(), 1, 1),

-- ===== NARUTO =====
('Naruto - Tập 1 (Tái bản 2025)',
 'Uzumaki Naruto, cậu bé mang Cửu Vĩ trong người, nuôi dưỡng giấc mơ trở thành Hokage mạnh nhất làng.',
 32000, 90,
 '/images/products/naruto1.jpg',
 true, 4.8, 620, 'NXB Kim Đồng', 188, 2025, 'completed',
 NOW(), 1, 2),

('Naruto - Tập 2 - Vị Khách Khó Ưa (Tái bản 2025)',
 'Sau khi vượt qua bài kiểm tra khó nhằn của thầy Kakashi, 3 Genin Naruto, Sasuke và Sakura nhận được một nhiệm vụ lớn!',
 32000, 70,
 '/images/products/naruto2.jpg',
 false, 4.7, 300, 'NXB Kim Đồng', 204, 2025, 'completed',
 NOW(), 1, 2),

-- ===== CONAN =====
('Thám Tử Conan - Tập 1',
 'Thám tử thiên tài Kudo Shinichi bị biến thành đứa trẻ sau khi uống thuốc bí ẩn.',
 25000, 120,
 '/images/products/conan1.jpg',
 true, 4.7, 530, 'NXB Kim Đồng', 192, 1996, 'ongoing',
 NOW(), 1, 3),

('Thám Tử Conan - Tập 2',
 'Conan tiếp tục điều tra các vụ án bí ẩn trong khi giữ bí mật danh tính thật của mình.',
 25000, 100,
 '/images/products/conan2.jpg',
 false, 4.7, 280, 'NXB Kim Đồng', 192, 1996, 'ongoing',
 NOW(), 1, 3),

-- ===== DRAGON BALL =====
('Dragon Ball - Tập 1',
 'Son Goku, cậu bé có đuôi khỉ sở hữu sức mạnh phi thường, bắt đầu hành trình tìm 7 viên ngọc rồng.',
 30000, 85,
 '/images/products/dragon-ball1.jpg',
 true, 4.9, 510, 'NXB Kim Đồng', 192, 1985, 'completed',
 NOW(), 1, 4),

-- ===== SWORD ART =====
('SWORD ART ONLINE 11',
 'Kirito và Eugeo đã trở thành kiếm sinh ưu tú ở Học viện Kiếm thuật Đế quốc Bắc Centoria, hằng ngày chăm chỉ luyện tập để trở thành Hiệp sĩ Chỉnh hợp, gia nhập lực lượng giữ gìn trật tự mạnh nhất Nhân giới.',
 95000, 75,
 '/images/products/sword-art11.jpg',
 true, 4.8, 490, 'NXB Văn Học', 192, 2019, 'completed',
 NOW(), 2, 5),
 
 ('SWORD ART ONLINE 12',
 'Kirito và Eugeo đã trở thành kiếm sinh ưu tú ở Học viện Kiếm thuật Đế quốc Bắc Centoria, hằng ngày chăm chỉ luyện tập để trở thành Hiệp sĩ Chỉnh hợp, gia nhập lực lượng giữ gìn trật tự mạnh nhất Nhân giới.',
 95000, 75,
 '/images/products/sword-art11.jpg',
 false, 4.8, 490, 'NXB Văn Học', 192, 2019, 'completed',
 NOW(), 2, 5),

-- ===== ONG GIA & BIEN CA =====
('Ông già và biển cả',
 'Ông Già Và Biển Cả là một trong những tác phẩm nổi tiếng nhất của Hemingway, sử dụng nguyên lý “tảng băng trôi” khi kể về một cuộc săn đuổi con cá kiếm khổng lồ của ông lão đánh cá Santiago.',
 89000, 45,
 '/images/products/og&bc_1.jpg',
 false, 4.5, 180, 'NXB Dân Trí', 256, 2025, 'completed',
 NOW(), 3, 6),

-- ===== YOUR NAME =====
('Your Name (Tái bản 2025)',
 'Mitsuha là nữ sinh trung học sống ở vùng quê hẻo lánh. Một ngày nọ, cô mơ thấy mình ở Tokyo trong một căn phòng xa lạ, biến thành con trai, gặp những người bạn chưa từng quen biết.',
 84000, 50,
 '/images/products/your-name_1.jpg',
 true, 4.6, 380, 'NXB Hồng Đức', 208, 2025, 'completed',
 NOW(), 3, 7),

-- ===== NGÔN TÌNH =====
('Yêu em từ cái nhìn đầu tiên (Tái bản 2023)',
 'Câu chuyện về chuyện tình ngọt ngào giữa người đẹp Vy Vy và Đại Thần Tiêu Nại.',
 175000, 60,
 '/images/products/yetcndt_1.jpg',
 false, 4.6, 450, 'NXB Văn Học', 508, 2023, 'completed',
 NOW(), 4, 8),

('Bên nhau trọn đời  (Tái bản)',
 '“Bên nhau trọn đời”: Giấc mơ của tình yêu_Phương Lâm Tình yêu giống những nốt nhạc của điệu valse, nhẹ nhàng mà tha thiết tới khó quên.',
 88000, 60,
 '/images/products/bntd.jpg',
 false, 4.6, 350, 'NXB Văn Học', 360, 2014, 'completed',
 NOW(), 4, 8),

-- ===== TRINH THÁM =====
('Sherlock Holmes - Tập 1 (Tái bản 2023)',
 '"Tên tôi là Sherlock Holmes. Công việc của tôi là tìm hiểu những gì mà người khác không biết…"',
 150000, 200,
 '/images/products/sherlock-holmes1.jpg',
 false, 4.9, 320, 'NXB Kim Đồng', 684, 2023, 'completed',
 NOW(), 5, 9),

('Sherlock Holmes - Tập 2 (Tái bản 2023)',
 '"Tên tôi là Sherlock Holmes. Công việc của tôi là tìm hiểu những gì mà người khác không biết…"',
 150000, 200,
 '/images/products/sherlock-holmes1.jpg',
 false, 4.9, 320, 'NXB Kim Đồng', 684, 2023, 'completed',
 NOW(), 5, 9)
ON CONFLICT DO NOTHING;

-- ===== THÊM VOUCHER MẪU =====
INSERT INTO voucher (code, discount_percent, expiry_date, is_active, max_uses, used_count) VALUES
('WELCOME10', 10, '2026-12-31', true, 100, 0),
('CHAOHE26', 26, '2026-12-31', true, 80, 0),
('SALE20',    20, '2026-06-30', true, 50,  0),
('COMICOP15', 15, '2026-09-30', true, 200, 0)
ON CONFLICT DO NOTHING;