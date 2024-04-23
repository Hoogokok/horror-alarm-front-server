package org.alram.horroralarmbackend.alarm;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.time.LocalDate;
import lombok.Data;


@Data
public class TokenRequest {

    @JsonDeserialize(using = TokenDeserializer.class)
    private String token;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate time;

    public TokenRequest() {
    }

    public TokenRequest(String token, LocalDate time) {
        this.token = token;
        this.time = time;
    }
}
