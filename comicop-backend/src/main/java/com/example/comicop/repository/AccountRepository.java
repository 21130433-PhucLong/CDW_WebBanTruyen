package com.example.comicop.repository;

import com.example.comicop.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

// JpaRepository<Account, Long>:
// - Account: Entity class quản lý
// - Long: kiểu dữ liệu của @Id (primary key)
// Spring Data JPA tự tạo sẵn các method:
// save(), findById(), findAll(), deleteById()... mà không cần viết SQL
public interface AccountRepository extends JpaRepository<Account, Long> {

    // Tìm account theo email — Spring tự sinh SQL:
    // SELECT * FROM account WHERE email = ?
    // Sẽ dùng ở Ngày 4 khi làm Auth (kiểm tra email khi đăng nhập)
    Account findByEmail(String email);

    // Kiểm tra email đã tồn tại chưa — dùng khi đăng ký
    boolean existsByEmail(String email);
}