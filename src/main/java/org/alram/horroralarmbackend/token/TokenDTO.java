package org.alram.horroralarmbackend.token;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;


@Data
public class TokenDTO {
    @JsonDeserialize(using = TokenDeserializer.class)
    private String token;

    public TokenDTO() {
    }
    public TokenDTO(String token) {
        this.token = token;
    }
}
