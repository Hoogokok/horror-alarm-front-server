package org.alram.horroralarmbackend.messaging;

import java.util.List;
import java.util.Optional;
import org.alram.horroralarmbackend.alarm.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicToTokenRepository extends JpaRepository<TopicToToken, Long> {

   List<TopicToToken> findByToken(Token token);

    Optional<TopicToToken> findByTokenAndTopic(Token token, Topic topic);
}
