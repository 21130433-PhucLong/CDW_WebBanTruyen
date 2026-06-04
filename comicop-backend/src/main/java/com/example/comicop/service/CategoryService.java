package com.example.comicop.service;

import com.example.comicop.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAll();
    CategoryDto getById(Long id);
}