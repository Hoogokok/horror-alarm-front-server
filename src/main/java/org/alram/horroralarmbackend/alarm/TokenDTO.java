package org.alram.horroralarmbackend.alarm;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;


@Data
public class TokenDTO {
    @JsonDeserialize(using = TokenDeserializer.class)
    private String token;

    private String topic;

    private String time;

    public TokenDTO() {
    }

    public TokenDTO(String token, String topic, String time) {
        this.token = token;
        this.topic = topic;
        this.time = time;
    }
}
