package org.alram.horroralarmbackend.streaming;

import lombok.Data;

@Data
public class ExpiredMovie {

    private final Long id;
    private final String title;
    private final String posterPath;
    private final String expiredDate;

    public ExpiredMovie(Long id, String title, String posterPath, String expiredDate) {
        this.id = id;
        this.title = title;
        this.posterPath = posterPath;
        this.expiredDate = expiredDate;
    }
}
