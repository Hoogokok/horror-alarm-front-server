package org.alram.horroralarmbackend.alarm;

public enum TopicContent {
    UPCOMING_MOVIE("upcoming_movie"),
    NETFLIX_EXPIRED("netflix_expired");

    private final String content;

    TopicContent(String content) {
        this.content = content;
    }

    public static boolean isTopicContent(String tokenContent) {
        return tokenContent.equals(UPCOMING_MOVIE.content) || tokenContent.equals(NETFLIX_EXPIRED.content);
    }
}
