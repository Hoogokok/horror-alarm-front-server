package org.alram.horroralarmbackend.alarm;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

@Data
public class TopicSubscribeRequest {

    @JsonDeserialize(using = TokenDeserializer.class)
    private String token;

    private String topic;

    public TopicSubscribeRequest() {
    }

    public TopicSubscribeRequest(String token, String topic) {
        this.token = token;
        this.topic = topic;
    }
}
