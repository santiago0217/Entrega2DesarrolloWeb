package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AutenticacionInterceptor autenticacionInterceptor;
    private final ApiAutenticacionInterceptor apiAutenticacionInterceptor;

    public WebConfig(AutenticacionInterceptor autenticacionInterceptor,
                     ApiAutenticacionInterceptor apiAutenticacionInterceptor) {
        this.autenticacionInterceptor = autenticacionInterceptor;
        this.apiAutenticacionInterceptor = apiAutenticacionInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Vistas Thymeleaf
        registry.addInterceptor(autenticacionInterceptor)
                .addPathPatterns("/admin/**", "/gerente/**", "/barbero/**", "/cliente/**");
        // API REST que usa Angular
        registry.addInterceptor(apiAutenticacionInterceptor)
                .addPathPatterns("/api/admin/**", "/api/gerente/**", "/api/barbero/**", "/api/cliente/**");
    }

    // Angular (puerto 4200) envía la cookie de sesión, por eso allowCredentials
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowCredentials(true);
    }
}
