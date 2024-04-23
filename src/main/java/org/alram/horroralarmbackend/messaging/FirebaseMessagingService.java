package org.alram.horroralarmbackend.messaging;

import com.google.api.core.ApiFuture;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.TopicManagementResponse;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.alram.horroralarmbackend.alarm.TopicSubscribeRequest;
import org.alram.horroralarmbackend.alarm.TopicSubscribeResponse;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FirebaseMessagingService {

    public static void send(MessageDTO messageDTO) {
        try {
            log.info("Firebase Cloud Messaging 메시지 전송을 시작합니다.");
            Message message = Message.builder()
                .putData("title", messageDTO.getTitle())
                .putData("body", messageDTO.getBody())
                .setTopic(messageDTO.getTopic())
                .build();
            FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            log.error("Firebase Cloud Messaging 전송에 실패했습니다.", e);
        }
    }

    public static TopicSubscribeResponse subscribeTopic(TopicSubscribeRequest token) {
        try {
            log.info("topic: " + token.getTopic());
           FirebaseMessaging.getInstance()
                .subscribeToTopic(List.of(token.getToken()), token.getTopic());
            return new TopicSubscribeResponse(true, "구독이 완료되었습니다.");
        } catch (FirebaseMessagingException e) {
            log.error("Firebase Cloud Messaging 구독에 실패했습니다.", e);
        }
        return new TopicSubscribeResponse(false, "구독에 실패했습니다.");
    }

    public static TopicSubscribeResponse unsubscribeFromTopic(TopicSubscribeRequest token) {
        log.info("Firebase Cloud Messaging 구독 해제를 시작합니다.");
        List<String> tokens = new ArrayList<>();
        tokens.add(token.getToken());
        ApiFuture<TopicManagementResponse> topicManagementResponseApiFuture = FirebaseMessaging.getInstance()
            .unsubscribeFromTopicAsync(tokens, token.getTopic());
        try {
            TopicManagementResponse topicManagementResponse = topicManagementResponseApiFuture.get();
            log.info("Firebase Cloud Messaging 구독 해제가 완료되었습니다.");
            log.info("topicManagementResponse: " + topicManagementResponse);
            return new TopicSubscribeResponse(true, "구독이 해제되었습니다.");
        } catch (Exception e) {
            log.error("Firebase Cloud Messaging 구독 해제에 실패했습니다.", e);
        }
        return new TopicSubscribeResponse(false, "구독 해제에 실패했습니다.");
    }
}
