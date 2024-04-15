package org.alram.horroralarmbackend.messaging;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
public class MessagingController {
    private final HorrorReleaseMessageBuilder horrorReleaseMessageBuilder;

    public MessagingController(HorrorReleaseMessageBuilder horrorReleaseMessageBuilder) {
        this.horrorReleaseMessageBuilder = horrorReleaseMessageBuilder;
    }

    @GetMapping("/alarm/horror/send-release-message")
    public ResponseEntity<String> sendHorrorReleaseMessage() {
        MessageDTO messageDTO = horrorReleaseMessageBuilder.buildMessage("horror-release", List.of("공포영화1", "공포영화2"));
        FirebaseMessagingService.send(messageDTO);
        return ResponseEntity.ok("메시지 전송이 완료되었습니다.");
    }
}
