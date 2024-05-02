package org.alram.horroralarmbackend.messaging;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.TopicManagementResponse;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.alram.horroralarmbackend.alarm.TokenUpdateResponse;
import org.alram.horroralarmbackend.alarm.TopicContent;
import org.alram.horroralarmbackend.alarm.TopicReSubscribeRequest;
import org.alram.horroralarmbackend.alarm.TopicSubscribeRequest;
import org.alram.horroralarmbackend.alarm.TopicSubscribeResponse;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FirebaseMessagingService {

    public TopicSubscribeResponse subscribeTopic(TopicSubscribeRequest token) {
        String tokenContent = token.getTopic();
        log.info("topic: " + tokenContent);
        if (!TopicContent.isTopicContent(tokenContent)) {
            log.info("토픽이 존재하지 않습니다.");
            throw new IllegalArgumentException("토픽이 존재하지 않습니다.");
        }
        try {
            FirebaseMessaging.getInstance()
                .subscribeToTopic(List.of(token.getToken()), token.getTopic());
            return new TopicSubscribeResponse(true, "구독이 완료되었습니다.");
        } catch (FirebaseMessagingException e) {
            log.error("Firebase Cloud Messaging 구독에 실패했습니다.", e);
        }
        return new TopicSubscribeResponse(false, "구독에 실패했습니다.");
    }

    public TopicSubscribeResponse unsubscribeFromTopic(TopicSubscribeRequest token) {
        log.info("Firebase Cloud Messaging 구독 해제를 시작합니다.");
        List<String> tokens = new ArrayList<>();
        tokens.add(token.getToken());
        try {
            FirebaseMessaging.getInstance().unsubscribeFromTopic(tokens, token.getTopic());
            return new TopicSubscribeResponse(true, "구독 해제가 완료되었습니다.");
        } catch (FirebaseMessagingException e) {
            log.error("Firebase Cloud Messaging 구독 해제에 실패했습니다.", e);
        }
        return new TopicSubscribeResponse(false, "구독 해제에 실패했습니다.");
    }

    public TokenUpdateResponse reSubscribeTopic(TopicReSubscribeRequest response) {
        log.info("Firebase Cloud Messaging 재구독을 시작합니다..");
        List<String> topicContents = response.topicContents();
        if (topicContents.isEmpty()) {
            log.info("재구독할 토픽이 없습니다.");
            return new TokenUpdateResponse(response.message());
        }
        topicContents.forEach(topic -> {
            TopicSubscribeRequest request = new TopicSubscribeRequest(response.token(), topic);
            subscribeTopic(request);
        });
        return new TokenUpdateResponse(response.message());
    }
}
