package org.alram.horroralarmbackend.streaming;

import lombok.Getter;

@Getter
public class NetflixExpiredResponse {

    private final String title;
    private final String overview;
    private final String posterPath;
    private final String expiredDate;

    public NetflixExpiredResponse(String title, String overview, String posterPath,
        String expiredDate) {
        this.title = title;
        this.overview = overview;
        this.posterPath = posterPath;
        this.expiredDate = expiredDate;
    }
}
