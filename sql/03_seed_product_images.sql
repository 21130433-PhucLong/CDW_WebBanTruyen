-- =============================================
-- SEED DỮ LIỆU: PRODUCT IMAGE GALLERY
-- Chạy sau 02_seed_products.sql
-- =============================================

INSERT INTO product_image (image_url, sort_order, product_id) VALUES

-- One Piece 1
('/images/products/onepiece1.jpg', 0, 1),
('/images/products/onepiece1_1.jpg', 1, 1),
('/images/products/onepiece1_2.jpg', 2, 1),

-- One Piece 2
('/images/products/onepiece2.jpg', 0, 2),
('/images/products/onepiece2_1.jpg', 1, 2),
('/images/products/onepiece2_2.jpg', 2, 2),

-- Naruto 1
('/images/products/naruto1.jpg', 0, 3),
('/images/products/naruto1_1.jpg', 1, 3),

-- Naruto 2
('/images/products/naruto2.jpg', 0, 4),
('/images/products/naruto2_1.jpg', 1, 4),

-- Conan 1
('/images/products/conan1.jpg', 0, 5),
('/images/products/conan1_1.jpg', 1, 5),

-- Conan 2
('/images/products/conan2.jpg', 0, 6),
('/images/products/conan2_1.jpg', 1, 6),
('/images/products/conan2_2.jpg', 2, 6),

-- Dragon Ball 1
('/images/products/dragon-ball1.jpg', 0, 7),
('/images/products/dragon-ball1_1.jpg', 1, 7),
('/images/products/dragon-ball1_2.jpg', 2, 7),

-- Sword Art Online 11
('/images/products/sword-art11.jpg', 0, 8),
('/images/products/sword-art11_1.jpg', 1, 8),
('/images/products/sword-art11_2.jpg', 2, 8),
('/images/products/sword-art11_3.jpg', 3, 8),

-- Sword Art Online 12
('/images/products/sword-art11.jpg', 0, 9),
('/images/products/sword-art11_1.jpg', 1, 9),
('/images/products/sword-art11_2.jpg', 2, 9),
('/images/products/sword-art11_3.jpg', 3, 9),

-- Ông già và biển cả
('/images/products/og&bc_1.jpg', 0, 10),
('/images/products/og&bc_2.jpg', 1, 10),

-- Your Name
('/images/products/your-name_1.jpg', 0, 11),
('/images/products/your-name_2.jpg', 1, 11),
('/images/products/your-name_3.jpg', 2, 11),
('/images/products/your-name_4.jpg', 3, 11),

-- Yêu em từ cái nhìn đầu tiên
('/images/products/yetcndt_1.jpg', 0, 12),
('/images/products/yetcndt_2.jpg', 1, 12),
('/images/products/yetcndt_3.jpg', 2, 12),

-- Bên nhau trọn đời
('/images/products/bntd.jpg', 0, 13),

-- Sherlock Holmes 1
('/images/products/sherlock-holmes1.jpg', 0, 14),
('/images/products/sherlock-holmes1_1.jpg', 1, 14),

-- Sherlock Holmes 2
('/images/products/sherlock-holmes1.jpg', 0, 15),
('/images/products/sherlock-holmes1_1.jpg', 1, 15)
ON CONFLICT DO NOTHING;
