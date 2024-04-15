package org.alram.horroralarmbackend.messaging;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class HorrorReleaseMessageBuilder {

    public MessageDTO buildMessage(String topic, List<String> releaseMovies) {
        StringBuilder messageBuilder = new StringBuilder("오늘 개봉하는 공포영화 목록입니다.\n");
        releaseMovies.forEach(releaseMovie -> messageBuilder.append(releaseMovie).append("\n"));
        return new MessageDTO("오늘 개봉하는 공포영화 목록", messageBuilder.toString(),topic);
    }
}
