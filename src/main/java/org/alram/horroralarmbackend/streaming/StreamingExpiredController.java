package org.alram.horroralarmbackend.streaming;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StreamingExpiredController {

    private static final Logger log = LoggerFactory.getLogger(StreamingExpiredController.class);
    private final NetflixExpiredService netflixExpiredService;

    public StreamingExpiredController(NetflixExpiredService netflixExpiredService) {
        this.netflixExpiredService = netflixExpiredService;
    }

    @GetMapping("/streaming/expired")
    public ExpiredResponse getNetflixExpiredResponse() {
        return netflixExpiredService.getNetflixExpiredResponse();
    }

    @GetMapping("/streaming/expired/detail/{id}")
    public ExpiredDetailResponse getNetflixExpiredDetailResponse(@PathVariable("id") Long id) {
        return netflixExpiredService.getNetflixExpiredDetailResponse(id);
    }
}
