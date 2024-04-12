package org.alram.horroralarmbackend.messaging;

import java.util.List;
import lombok.Data;

@Data
public class MessageDTO {
    private final String title;
    private final String body;
    private final String topic;
}
