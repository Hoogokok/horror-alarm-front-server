package org.alram.horroralarmbackend.alarm;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.alram.horroralarmbackend.messaging.Topic;
import org.alram.horroralarmbackend.messaging.TopicToToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Transactional
@Service
public class TokenService {

    private TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public Token saveToken(TokenRequest tokenRequest) {
        Token token = new Token(tokenRequest.getToken(), tokenRequest.getTime());
        return tokenRepository.save(token);
    }

    public void deleteToken(TokenRequest token) {
        Optional<Token> byToken = tokenRepository.findByToken(token.getToken());
        if (byToken.isEmpty()) {
            log.error("Token not found");
            return;
        }
        tokenRepository.delete(byToken.get());
    }

    public TokenTimeCheckedRequest checkedTokenTimesPassedTheMonth(String token) {
        Optional<Token> time = tokenRepository.findByToken(token);
        if (time.isEmpty()) {
            log.error("Token not found");
            return new TokenTimeCheckedRequest(false, token, TimeCheckResult.NOT_EXIST);
        }
        LocalDate now = LocalDate.now();
        LocalDate tokenTimestamp = time.get().getTime();
        if (isMonthPassed(tokenTimestamp, now)) {
            log.info("한달이 지났습니다.");
            return new TokenTimeCheckedRequest(true, token, TimeCheckResult.EXIST);
        }
        return new TokenTimeCheckedRequest(false, token, TimeCheckResult.EXIST);
    }

    public boolean isMonthPassed(LocalDate date1, LocalDate date2) {
        return ChronoUnit.MONTHS.between(date1, date2) >= 1;
    }

    public TopicReSubscribeRequest updateToken(TokenUpdateRequest tokenUpdateRequest) {
        Optional<Token> oldToken = tokenRepository.findByToken(tokenUpdateRequest.getOldToken());
        if (oldToken.isEmpty()) {
            log.error("Token not found");
            return new TopicReSubscribeRequest(tokenUpdateRequest.getOldToken(), List.of(),
                "Token not found");
        }
        Token token1 = oldToken.get();
        token1.update(tokenUpdateRequest.getNewToken(), tokenUpdateRequest.getNewTime());
        Token updateToken = tokenRepository.save(token1);
        List<TopicToToken> topicToTokens = updateToken.getTopicToTokens();
        if (topicToTokens.isEmpty()) {
            return new TopicReSubscribeRequest(updateToken.getToken(), List.of(),
                "Token updated");
        }

        List<String> topicNames = topicToTokens.stream().map(TopicToToken::getTopic)
            .map(Topic::getName)
            .toList();

        return new TopicReSubscribeRequest(updateToken.getToken(), topicNames, "Token updated");
    }

    public TopicCheckedResponse checkedTopicSubscribe(String token) {
        Optional<Token> byToken = tokenRepository.findByToken(token);
        if (byToken.isEmpty()) {
            log.error("Token not found");
            return new TopicCheckedResponse(List.of(), "Token not found");
        }
        Token token1 = byToken.get();
        List<TopicToToken> topicToTokens = token1.getTopicToTokens();
        if (topicToTokens.isEmpty()) {
            return new TopicCheckedResponse(List.of(), "Topic not found");
        }
        List<String> topicNames = topicToTokens.stream()
            .map(TopicToToken::getTopic)
            .map(Topic::getName)
            .toList();
        return new TopicCheckedResponse(topicNames, "Topic found");
    }

    public Token findToken(String token) {
        Optional<Token> byToken = tokenRepository.findByToken(token);
        if (byToken.isEmpty()) {
            log.error("Token not found");
            throw new IllegalArgumentException("Token not found");
        }
        return byToken.get();
    }
}
