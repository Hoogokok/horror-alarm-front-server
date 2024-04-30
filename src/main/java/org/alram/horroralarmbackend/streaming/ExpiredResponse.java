package org.alram.horroralarmbackend.streaming;

import java.util.List;

public record ExpiredResponse(List<ExpiredMovie> expiredMovies) {

}
