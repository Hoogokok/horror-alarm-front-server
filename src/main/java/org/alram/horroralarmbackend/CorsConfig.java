package org.alram.horroralarmbackend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000") // 허용할 Origin
            .allowedMethods("GET", "POST", "PUT", "DELETE") // 허용할 HTTP Method
            .allowCredentials(true) // 클라이언트에서 쿠키 전송 허용
            .maxAge(3600); // 프리플라이트 요청 캐싱 시간 (초 단위)
    }
}