package org.alram.horroralarmbackend.messaging;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FirebaseMessagingService {
    private FirebaseMessagingService() {
        FirebaseAdminConfig.init();
    }

    public static void send(Message message) {
        try {
            FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            log.error("Firebase Cloud Messaging 전송에 실패했습니다.", e);
        }
    }

    public static void deleteToken(String token) {
        try {
            FirebaseMessaging.getInstance().unsubscribeFromTopic(List.of(token), "horror-alarm");
        } catch (FirebaseMessagingException e) {
            log.error("Firebase Cloud Messaging 구독 해제에 실패했습니다.", e);
        }
    }
}
