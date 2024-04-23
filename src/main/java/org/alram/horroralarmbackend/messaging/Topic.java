package org.alram.horroralarmbackend.messaging;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;

@Getter
@Entity
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "topic")
    private List<TopicToToken> topicToTokens = new ArrayList<>();

    public Topic() {
    }

    public Topic(String name) {
        this.name = name;
    }

    public void updateSubscriber(TopicToToken topicToToken) {
        topicToTokens.add(topicToToken);
    }
}
