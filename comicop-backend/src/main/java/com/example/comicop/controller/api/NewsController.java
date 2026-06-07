package com.example.comicop.controller.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Value("${gnews.token:5e5f65e5fe2038c5e67fb2d228fd6e24}")
    private String gnewsToken;

    @GetMapping
    public ResponseEntity<Object> getNews(
            @RequestParam(defaultValue = "manga") String q,
            @RequestParam(defaultValue = "vi") String lang,
            @RequestParam(defaultValue = "10") int max) {

        // Dùng UriComponentsBuilder để tự encode URL đúng chuẩn
        // Tránh lỗi 403 do khoảng trắng trong query không được encode
        String url = UriComponentsBuilder
                .fromHttpUrl("https://gnews.io/api/v4/search")
                .queryParam("q", q)
                .queryParam("lang", lang)
                .queryParam("max", max)
                .queryParam("token", gnewsToken)
                .toUriString();

        try {
            RestTemplate restTemplate = new RestTemplate();
            Object response = restTemplate.getForObject(url, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    java.util.Map.of(
                            "error", e.getMessage()
                    )
            );
        }
    }
}