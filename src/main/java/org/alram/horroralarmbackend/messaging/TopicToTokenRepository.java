package org.alram.horroralarmbackend.messaging;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicToTokenRepository extends JpaRepository<TopicToToken, Long> {

}
