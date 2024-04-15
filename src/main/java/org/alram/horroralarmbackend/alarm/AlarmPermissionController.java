package org.alram.horroralarmbackend.alarm;

import lombok.extern.slf4j.Slf4j;
import org.alram.horroralarmbackend.messaging.FirebaseMessagingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class AlarmPermissionController {
    private final TokenService tokenService;


    public AlarmPermissionController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/alarm/permission")
    public ResponseEntity<TokenDTO> saveToken(@RequestBody TokenDTO tokenDTO) {
        log.info("tokenDTO: " + tokenDTO);
        tokenService.saveToken(tokenDTO);
        return ResponseEntity.ok(tokenDTO);
    }

    @DeleteMapping("/alarm/permission")
    public ResponseEntity<TokenDTO> deleteToken(@RequestBody TokenDTO tokenDTO) {
        log.info("tokenDTO: " + tokenDTO);
        tokenService.deleteToken(tokenDTO);
        return ResponseEntity.ok(tokenDTO);
    }

    @PostMapping("/alarm/horror/subscribe")
    public ResponseEntity<String> subscribe(@RequestBody TokenDTO token) {
        FirebaseMessagingService.subscribeTopic(token);
        return ResponseEntity.ok("알람이 설정되었습니다.");
    }

    @DeleteMapping("/alarm/horror/unsubscribe")
    public ResponseEntity<String> unsubscribe(@RequestBody TokenDTO token) {
        FirebaseMessagingService.unsubscribeFromTopic(token);
        return ResponseEntity.ok("알람이 해제되었습니다.");
    }

}
