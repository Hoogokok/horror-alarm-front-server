package org.alram.horroralarmbackend.messaging;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import org.alram.horroralarmbackend.alarm.Token;

@Getter
@Entity
public class TopicToToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Topic topic;

    @ManyToOne
    private Token token;

    public TopicToToken() {
    }

    public TopicToToken(Topic topic, Token token) {
        this.topic = topic;
        this.token = token;
    }
}
