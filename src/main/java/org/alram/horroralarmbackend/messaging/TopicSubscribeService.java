package org.alram.horroralarmbackend.messaging;

import jakarta.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import org.alram.horroralarmbackend.alarm.Token;
import org.springframework.stereotype.Service;

@Transactional
@Service
public class TopicSubscribeService {

    private final TopicRepository topicRepository;
    private final TopicToTokenRepository topicToTokenRepository;

    public TopicSubscribeService(TopicRepository topicRepository,
        TopicToTokenRepository topicToTokenRepository) {
        this.topicRepository = topicRepository;
        this.topicToTokenRepository = topicToTokenRepository;
    }

    public TopicToToken subscribe(Token token, String topicName) {
        Topic topic = topicRepository.findByName(topicName)
            .orElseGet(() -> topicRepository.save(new Topic(topicName)));
        TopicToToken topicToToken = topicToTokenRepository.save(new TopicToToken(topic, token));
        token.subscribedTopic(topicToToken);
        topic.updateSubscriber(topicToToken);
        return topicToToken;
    }

    public List<Topic> findTopicByToken(Token token) {
        List<TopicToToken> topicToTokens = topicToTokenRepository.findByToken(token);
        if (topicToTokens.isEmpty()) {
            return Collections.emptyList();
        }

        return topicToTokens.stream()
            .map(TopicToToken::getTopic)
            .toList();
    }

    public void unsubscribe(Token token, String topicName) {
        Topic topic = topicRepository.findByName(topicName)
            .orElseThrow(() -> new IllegalArgumentException("Topic is not exist"));
        TopicToToken topicToToken = topicToTokenRepository.findByTokenAndTopic(token, topic)
            .orElseThrow(() -> new IllegalArgumentException("Token is not subscribed to the topic"));
        token.unsubscribedTopic(topicToToken);
        topic.removeSubscriber(topicToToken);
        topicToTokenRepository.delete(topicToToken);
    }
}
