package com.example.comicop.service.implement;

import com.example.comicop.dto.AuthorDto;
import com.example.comicop.entity.Author;
import com.example.comicop.exception.ResourceNotFoundException;
import com.example.comicop.repository.AuthorRepository;
import com.example.comicop.repository.ProductRepository;
import com.example.comicop.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final ProductRepository productRepository;

    private AuthorDto mapToDto(Author author) {
        int mangaCount = productRepository
                .findByAuthor_AuthorId(author.getAuthorId()).size();

        return new AuthorDto(
                author.getAuthorId(),
                author.getName(),
                author.getAvatarUrl(),   // = image trong frontend
                author.getBio(),          // = biography trong frontend
                author.getNationality(),
                mangaCount
        );
    }

    @Override
    public List<AuthorDto> getAll() {
        return authorRepository.findAll()
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AuthorDto getById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy tác giả với id: " + id));
        return mapToDto(author);
    }

    @Override
    public List<AuthorDto> getPopular() {
        // Lấy tất cả tác giả sắp xếp theo số lượng sản phẩm giảm dần
        return authorRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .sorted((a, b) -> b.getMangaCount() - a.getMangaCount())
                .limit(6)
                .collect(Collectors.toList());
    }
}