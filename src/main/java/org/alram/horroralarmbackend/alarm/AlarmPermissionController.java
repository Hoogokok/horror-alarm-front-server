package org.alram.horroralarmbackend.alarm;

import lombok.extern.slf4j.Slf4j;
import org.alram.horroralarmbackend.messaging.FirebaseMessagingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class AlarmPermissionController {

    private final TokenService tokenService;

    public AlarmPermissionController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping("/alarm/checked/times")
    public ResponseEntity<TokenTimeCheckedRequest> checkedTokenTimes(@RequestParam("token") String token) {
        return ResponseEntity.ok(tokenService.checkedTokenTimesPassedTheMonth(token));
    }

    @PostMapping("/alarm/update/token")
    public ResponseEntity<TokenUpdateResponse> updateToken(@RequestBody TokenUpdateRequest token) {
        return ResponseEntity.ok(tokenService.updateToken(token));
    }

    @PostMapping("/alarm/permission")
    public ResponseEntity<TokenRequest> saveToken(@RequestBody TokenRequest tokenRequest) {
        tokenService.saveToken(tokenRequest);
        return ResponseEntity.ok(tokenRequest);
    }

    @DeleteMapping("/alarm/permission")
    public ResponseEntity<TokenRequest> deleteToken(@RequestBody TokenRequest tokenRequest) {
        log.info("tokenDTO: " + tokenRequest);
        tokenService.deleteToken(tokenRequest);
        return ResponseEntity.ok(tokenRequest);
    }

    @PostMapping("/alarm/horror/subscribe")
    public ResponseEntity<TopicSubscribeResponse> subscribe(
        @RequestBody TopicSubscribeRequest token) {
        TopicSubscribeResponse topicSubscribeResponse = FirebaseMessagingService.subscribeTopic(token);
        return ResponseEntity.ok(topicSubscribeResponse);
    }

    @DeleteMapping("/alarm/horror/unsubscribe")
    public ResponseEntity<TopicSubscribeResponse> unsubscribe(
        @RequestBody TopicSubscribeRequest token) {
        TopicSubscribeResponse topicSubscribeResponse = FirebaseMessagingService.unsubscribeFromTopic(token);
        return ResponseEntity.ok(topicSubscribeResponse);
    }

}
