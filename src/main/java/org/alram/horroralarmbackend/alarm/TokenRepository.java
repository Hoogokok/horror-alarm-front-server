package org.alram.horroralarmbackend.alarm;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TokenRepository extends JpaRepository<Token, Long> {

    @Query("DELETE FROM Token t WHERE t.token = :token")
    void deleteByToken(@Param("token") String token);

    @Query("SELECT t FROM Token t WHERE t.token = :token")
    Optional<Token> findByToken(@Param("token") String token);
}
