package org.alram.horroralarmbackend.token;

import lombok.extern.slf4j.Slf4j;
import org.alram.horroralarmbackend.messaging.FirebaseMessagingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class TokenAPIController {
    private final TokenService tokenService;

    public TokenAPIController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/api/subscribe")
    public ResponseEntity<String> getToken(@RequestBody TokenDTO token) {
        tokenService.saveToken(token);
        return ResponseEntity.ok("알람이 설정되었습니다.");
    }

    @DeleteMapping("/api/unsubscribe")
    public ResponseEntity<String> deleteToken(@RequestBody TokenDTO token) {
        FirebaseMessagingService.deleteToken(token.getToken());
        tokenService.deleteToken(token);
        return ResponseEntity.ok("알람이 해제되었습니다.");
    }
}
