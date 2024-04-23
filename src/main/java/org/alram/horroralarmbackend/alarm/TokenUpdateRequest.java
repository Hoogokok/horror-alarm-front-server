package org.alram.horroralarmbackend.alarm;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.time.LocalDate;
import lombok.Data;

@Data
public class TokenUpdateRequest {

    @JsonDeserialize(using = TokenDeserializer.class)
    private String oldToken;
    @JsonDeserialize(using = TokenDeserializer.class)
    private String newToken;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate newTime;

    public TokenUpdateRequest() {
    }

    public TokenUpdateRequest(String oldToken, String newToken, LocalDate newTime) {
        this.oldToken = oldToken;
        this.newToken = newToken;
        this.newTime = newTime;
    }
}
