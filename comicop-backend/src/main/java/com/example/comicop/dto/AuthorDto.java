package com.example.comicop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorDto {
    private Long id;
    private String name;

    // = image trong Author interface frontend
    private String image;

    // = biography trong Author interface frontend
    private String biography;

    private String nationality;
    private Integer mangaCount;
}