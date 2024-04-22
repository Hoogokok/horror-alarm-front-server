package org.alram.horroralarmbackend.alarm;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import lombok.Getter;

@Entity
@Getter
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String token;
    @Column(nullable = false)
    private LocalDate time;

    public Token() {
    }

    public Token(String token, LocalDate time) {
        this.token = token;
        this.time = time;
    }

    public void update(String token, LocalDate time) {
        this.token = token;
        this.time = time;
    }
}
