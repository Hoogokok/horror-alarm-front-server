package org.alram.horroralarmbackend.alarm;

import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Transactional
@Service
public class TokenService {
    private TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public void saveToken(TokenDTO tokenDTO){
        Token token = new Token(tokenDTO.getToken());
        tokenRepository.save(token);
    }

    public void deleteToken(TokenDTO token) {
        Optional<Token> byToken = tokenRepository.findByToken(token.getToken());
        if (!byToken.isPresent()) {
            log.error("Token not found");
            return;
        }
        tokenRepository.delete(byToken.get());
    }

    public List<String> findAllTokens() {
        return tokenRepository.findAll().stream().map(Token::getToken).toList();
    }
}
