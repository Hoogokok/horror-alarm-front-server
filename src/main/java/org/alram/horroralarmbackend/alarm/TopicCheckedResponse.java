package org.alram.horroralarmbackend.alarm;

import java.util.List;

public record TopicCheckedResponse(List<String> topicContents, String message) {

}
