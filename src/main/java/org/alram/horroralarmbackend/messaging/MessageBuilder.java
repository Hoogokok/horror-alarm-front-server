package org.alram.horroralarmbackend.messaging;

import java.util.List;
import org.alram.horroralarmbackend.upcoming.MessageRequest;
import org.springframework.stereotype.Service;

@Service
public class MessageBuilder {

    public MessageDTO buildMessage(String topic, List<MessageRequest> upcomingMovies,
        String message) {
        StringBuilder messageBuilder = new StringBuilder();
        upcomingMovies.forEach(upcomingMovie -> messageBuilder.append(upcomingMovie.title())
            .append(" : ")
            .append(upcomingMovie.releaseDate())
            .append("\n"));
        return new MessageDTO(message, messageBuilder.toString(), topic);
    }
}
