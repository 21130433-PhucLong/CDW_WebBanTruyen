package com.example.comicop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import java.util.Locale;

// @Configuration — class này chứa cấu hình Spring
// I18n = Internationalization — hỗ trợ đa ngôn ngữ (vi/en)
// Thêm ?lang=vi hoặc ?lang=en vào URL để đổi ngôn ngữ
@Configuration
public class I18nConfig implements WebMvcConfigurer {

    // LocaleResolver — xác định ngôn ngữ hiện tại của user
    // SessionLocaleResolver lưu ngôn ngữ vào session
    @Bean
    public LocaleResolver localeResolver() {
        SessionLocaleResolver localeResolver = new SessionLocaleResolver();
        // Ngôn ngữ mặc định là tiếng Anh
        localeResolver.setDefaultLocale(Locale.ENGLISH);
        return localeResolver;
    }

    // LocaleChangeInterceptor — chặn request để đổi ngôn ngữ
    // Khi URL có ?lang=vi thì tự đổi sang tiếng Việt
    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor lci = new LocaleChangeInterceptor();
        // Tên param trên URL để đổi ngôn ngữ
        lci.setParamName("lang");
        return lci;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }
}