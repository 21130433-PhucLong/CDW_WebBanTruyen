package com.example.comicop.service.implement;

import com.example.comicop.config.JwtUtil;
import com.example.comicop.dto.AccountDto;
import com.example.comicop.dto.AuthRequest;
import com.example.comicop.dto.AuthResponse;
import com.example.comicop.dto.RegisterRequest;
import com.example.comicop.entity.Account;
import com.example.comicop.exception.ResourceNotFoundException;
import com.example.comicop.mapper.AccountMapper;
import com.example.comicop.repository.AccountRepository;
import com.example.comicop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Kiểm tra email đã tồn tại chưa
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng: " + request.getEmail());
        }

        // Tạo account mới từ RegisterRequest
        Account account = new Account();
        account.setEmail(request.getEmail());
        // Hash password trước khi lưu — KHÔNG BAO GIỜ lưu password thô
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setUserName(request.getUsername());
        account.setFirstName(request.getFirstName());
        account.setLastName(request.getLastName());
        // Mặc định role USER khi đăng ký
        account.setRole("USER");
        account.setActivated(true);

        // Lưu vào DB
        Account savedAccount = accountRepository.save(account);

        // Tạo JWT token
        String token = jwtUtil.generateToken(savedAccount.getEmail(), savedAccount.getRole());

        return new AuthResponse(token, AccountMapper.accountToAccountDto(savedAccount));
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        // Tìm account theo email
        Account account = accountRepository.findByEmail(request.getEmail());
        if (account == null) {
            throw new RuntimeException("Email không tồn tại");
        }
        // Kiểm tra password bằng BCrypt
        // passwordEncoder.matches() so sánh password thô với hash đã lưu
        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }

        // Kiểm tra tài khoản có bị khoá không
        if (!account.isActivated()) {
            throw new RuntimeException("Tài khoản đã bị khoá");
        }

        // Tạo JWT token
        String token = jwtUtil.generateToken(account.getEmail(), account.getRole());

        return new AuthResponse(token, AccountMapper.accountToAccountDto(account));
    }

    @Override
    public AccountDto getCurrentUser(String email) {
        Account account = accountRepository.findByEmail(email);
        if (account == null) {
            throw new ResourceNotFoundException("Không tìm thấy user với email: " + email);
        }
        return AccountMapper.accountToAccountDto(account);
    }
}