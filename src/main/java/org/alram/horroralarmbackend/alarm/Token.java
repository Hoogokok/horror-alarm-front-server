package org.alram.horroralarmbackend.alarm;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import org.alram.horroralarmbackend.messaging.TopicToToken;

@Entity
@Getter
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String token;
    @Column(nullable = false)
    private LocalDate time;
    @OneToMany(mappedBy = "token")
    private List<TopicToToken> topicToTokens = new ArrayList<>();

    public Token() {
    }

    public Token(String token, LocalDate time) {
        this.token = token;
        this.time = time;
    }

    public void update(String token, LocalDate time) {
        this.token = token;
        this.time = time;
    }

    public void subscribedTopic(TopicToToken topicToToken) {
        topicToTokens.add(topicToToken);
    }

    public void unsubscribedTopic(TopicToToken topicToToken) {
        topicToTokens.remove(topicToToken);
    }
}
