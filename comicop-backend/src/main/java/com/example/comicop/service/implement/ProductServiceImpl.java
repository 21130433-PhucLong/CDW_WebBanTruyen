package com.example.comicop.service.implement;

import com.example.comicop.dto.AuthorDto;
import com.example.comicop.dto.CategoryDto;
import com.example.comicop.dto.PageResponseDto;
import com.example.comicop.dto.ProductDto;
import com.example.comicop.entity.Product;
import com.example.comicop.entity.ProductImage;
import com.example.comicop.exception.ResourceNotFoundException;
import com.example.comicop.repository.ProductImageRepository;
import com.example.comicop.repository.ProductRepository;
import com.example.comicop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    // Chuyển Product entity thành ProductDto để trả về cho frontend
    private ProductDto mapToDto(Product product) {
        // Lấy danh sách ảnh gallery của product
        List<String> imageUrls = productImageRepository
                .findByProduct_ProductIdOrderBySortOrder(product.getProductId())
                .stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        // Build AuthorDto từ Author entity
        AuthorDto authorDto = null;
        if (product.getAuthor() != null) {
            authorDto = new AuthorDto(
                    product.getAuthor().getAuthorId(),
                    product.getAuthor().getName(),
                    product.getAuthor().getAvatarUrl(),   // = image trong frontend
                    product.getAuthor().getBio(),          // = biography trong frontend
                    product.getAuthor().getNationality(),
                    // Đếm số sản phẩm của tác giả
                    productRepository.findByAuthor_AuthorId(
                            product.getAuthor().getAuthorId()).size()
            );
        }

        // Build CategoryDto từ Category entity
        CategoryDto categoryDto = null;
        if (product.getCategory() != null) {
            categoryDto = new CategoryDto(
                    product.getCategory().getCategoryId(),
                    product.getCategory().getName(),
                    product.getCategory().getDescription(),
                    product.getCategory().getSlug(),
                    // Đếm số sản phẩm trong thể loại
                    productRepository.findByCategory_CategoryId(
                            product.getCategory().getCategoryId(),
                            Pageable.unpaged()).getNumberOfElements()
            );
        }

        return ProductDto.builder()
                .id(product.getProductId())
                .title(product.getTitle())
                .description(product.getDescription())
                .coverImage(product.getImageUrl())        // map imageUrl → coverImage
                .price(product.getPrice())
                .rating(product.getAverageRating())       // map averageRating → rating
                .stock(product.getStock())
                .soldCount(product.getSoldCount())
                .isFeatured(product.getIsFeatured())
                .isNew(product.getCreatedAt() != null &&
                        product.getCreatedAt().isAfter(
                                java.time.LocalDateTime.now().minusDays(30))) // Mới trong 30 ngày
                .author(authorDto)
                .categories(categoryDto != null ?
                        List.of(categoryDto) : Collections.emptyList())
                .publisher(product.getPublisher())
                .pages(product.getPages())
                .publishYear(product.getPublishYear())
                .status(product.getStatus())
                .images(imageUrls)
                .createdAt(product.getCreatedAt() != null ?
                        product.getCreatedAt().toString() : null)
                .build();
    }

    // Tạo Pageable với sort theo field được chỉ định
    private Pageable createPageable(int page, int size, String sortBy) {
        Sort sort = switch (sortBy) {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating"     -> Sort.by("averageRating").descending();
            case "sold"       -> Sort.by("soldCount").descending();
            default           -> Sort.by("createdAt").descending(); // mới nhất
        };
        return PageRequest.of(page, size, sort);
    }

    // Tạo PageResponseDto từ Page của Spring
    private PageResponseDto<ProductDto> toPageResponse(Page<ProductDto> page) {
        return PageResponseDto.<ProductDto>builder()
                .content(page.getContent())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .currentPage(page.getNumber())
                .pageSize(page.getSize())
                .isLast(page.isLast())
                .build();
    }

    @Override
    public PageResponseDto<ProductDto> getAll(int page, int size, String sortBy) {
        Pageable pageable = createPageable(page, size, sortBy);
        Page<ProductDto> result = productRepository.findAll(pageable)
                .map(this::mapToDto);
        return toPageResponse(result);
    }

    @Override
    public ProductDto getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với id: " + id));
        return mapToDto(product);
    }

    @Override
    public List<ProductDto> getFeatured() {
        return productRepository.findByIsFeaturedTrue()
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getNewReleases() {
        return productRepository.findTop8ByOrderByCreatedAtDesc()
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PageResponseDto<ProductDto> search(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto> result = productRepository
                .findByTitleContainingIgnoreCase(keyword, pageable)
                .map(this::mapToDto);
        return toPageResponse(result);
    }

    @Override
    public PageResponseDto<ProductDto> getByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("createdAt").descending());
        Page<ProductDto> result = productRepository
                .findByCategory_CategoryId(categoryId, pageable)
                .map(this::mapToDto);
        return toPageResponse(result);
    }

    @Override
    public List<ProductDto> getByAuthor(Long authorId) {
        return productRepository.findByAuthor_AuthorId(authorId)
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getTopSelling() {
        return productRepository.findTop6ByOrderBySoldCountDesc()
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getRelated(Long productId) {
        // Lấy thể loại của product hiện tại
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với id: " + productId));

        if (product.getCategory() == null) return Collections.emptyList();

        // Lấy sản phẩm cùng thể loại, trừ bản thân
        return productRepository
                .findByCategory_CategoryId(product.getCategory().getCategoryId(),
                        PageRequest.of(0, 6))
                .getContent()
                .stream()
                .filter(p -> !p.getProductId().equals(productId))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
}