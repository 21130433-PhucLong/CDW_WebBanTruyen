package com.example.comicop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private String slug;
    // Số lượng sản phẩm trong thể loại này
    private Integer count;
}