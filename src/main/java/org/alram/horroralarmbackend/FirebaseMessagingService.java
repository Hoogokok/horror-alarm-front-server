package org.alram.horroralarmbackend;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
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
}
