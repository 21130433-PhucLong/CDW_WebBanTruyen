package com.example.comicop.service;

import com.example.comicop.dto.AuthorDto;
import java.util.List;

public interface AuthorService {
    List<AuthorDto> getAll();
    AuthorDto getById(Long id);
    List<AuthorDto> getPopular();
}