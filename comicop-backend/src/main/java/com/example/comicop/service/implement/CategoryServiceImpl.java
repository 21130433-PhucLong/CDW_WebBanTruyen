package com.example.comicop.service.implement;

import com.example.comicop.dto.CategoryDto;
import com.example.comicop.entity.Category;
import com.example.comicop.exception.ResourceNotFoundException;
import com.example.comicop.repository.CategoryRepository;
import com.example.comicop.repository.ProductRepository;
import com.example.comicop.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    private CategoryDto mapToDto(Category category) {
        // Đếm số sản phẩm trong thể loại
        int count = productRepository
                .findByCategory_CategoryId(category.getCategoryId(), Pageable.unpaged())
                .getNumberOfElements();

        return new CategoryDto(
                category.getCategoryId(),
                category.getName(),
                category.getDescription(),
                category.getSlug(),
                count
        );
    }

    @Override
    public List<CategoryDto> getAll() {
        return categoryRepository.findAll()
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy thể loại với id: " + id));
        return mapToDto(category);
    }
}