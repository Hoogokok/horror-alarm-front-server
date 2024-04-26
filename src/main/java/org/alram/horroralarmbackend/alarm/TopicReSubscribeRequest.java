package org.alram.horroralarmbackend.alarm;

import java.util.List;

public record TopicReSubscribeRequest(String token, List<String> topicContents, String message) {

}